import { prisma } from "../lib/prisma.js";
import type { BookDto, BookQueryDto, UpdateBookDto } from "../schemas/book.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { cached, invalidate, invalidateByPattern } from "../utils/redisWrap.js";

const CACHE_TTL = 60 * 5;
const BOOKS_CACHE_KEY = (page: number, limit: number) => `books:list:page=${page}:limit=${limit}`;
export const BOOKS_CACHE_PATTERN = "books:list:*";
const BOOK_CACHE_KEY = (id: string) => `books:details:${id}`;
export const BOOK_DETAIL_CACHE_PATTERN = "books:details:*";

export const bookService = {
  getAll: async (query: BookQueryDto) => {
    const { page, limit, title, author, genreIds } = query;
    const skip = (page - 1) * limit;

    const parsedGenreIds = genreIds ? genreIds.split(",").map((id) => id.trim()) : undefined;

    if (parsedGenreIds) {
      const existingGenres = await prisma.genre.findMany({
        where: { id: { in: parsedGenreIds } },
        select: { id: true },
      });
      if (existingGenres.length !== parsedGenreIds.length)
        throw new ApiError(404, "One or more genres not found");
    }

    const cacheKey =
      BOOKS_CACHE_KEY(page, limit) +
      (title ? `:title=${title}` : "") +
      (author ? `:author=${author}` : "") +
      (parsedGenreIds ? `:genres=${parsedGenreIds.join(",")}` : "");

    return cached(cacheKey, CACHE_TTL, async () => {
      const where = {
        ...(title && { title: { contains: title, mode: "insensitive" as const } }),
        ...(author && { author: { contains: author, mode: "insensitive" as const } }),
        ...(parsedGenreIds && {
          genres: { some: { id: { in: parsedGenreIds } } },
        }),
      };

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          include: { genres: true },
          skip,
          take: limit,
          orderBy: { title: "asc" },
        }),
        prisma.book.count({ where }),
      ]);
      const result = {
        data: books.map((book) => ({
          ...book,
          releaseDate: book.releaseDate?.toISOString().split("T")[0] ?? null,
        })),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };

      return result;
    });
  },

  getById: async (id: string) => {
    return cached(BOOK_CACHE_KEY(id), CACHE_TTL, async () => {
      const book = await prisma.book.findUnique({
        where: { id },
        include: { genres: true },
      });
      if (!book) throw new ApiError(404, "Book not found");

      return {
        ...book,
        releaseDate: book.releaseDate?.toISOString().split("T")[0] ?? null,
      };
    });
  },

  createBook: async (data: BookDto) => {
    const existing = await prisma.book.findFirst({
      where: { title: data.title, author: data.author },
    });
    if (existing) throw new ApiError(409, "Book already exists");

    const genres = await prisma.genre.findMany({
      where: { id: { in: data.genreIds } },
    });
    if (genres.length !== data.genreIds.length)
      throw new ApiError(404, "One or more genres not found");

    const createdBook = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        ...(data.description !== undefined && { description: data.description }),
        ...(data.pages !== undefined && { pages: data.pages }),
        ...(data.releaseDate !== undefined && { releaseDate: new Date(data.releaseDate) }),
        genres: {
          connect: data.genreIds.map((id) => ({ id })),
        },
      },
      include: { genres: true },
    });

    await invalidateByPattern(BOOKS_CACHE_PATTERN);
    return createdBook;
  },

  updateBook: async (id: string, data: UpdateBookDto) => {
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Book not found");

    if (data.genreIds !== undefined) {
      const genres = await prisma.genre.findMany({
        where: { id: { in: data.genreIds } },
      });
      if (genres.length !== data.genreIds.length)
        throw new ApiError(404, "One or more genres not found");
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.pages !== undefined && { pages: data.pages }),
        ...(data.releaseDate !== undefined && { releaseDate: new Date(data.releaseDate) }),
        ...(data.genreIds !== undefined && {
          genres: { set: data.genreIds.map((genreId) => ({ id: genreId })) },
        }),
      },
      include: { genres: true },
    });

    await invalidateByPattern(BOOKS_CACHE_PATTERN);
    await invalidate(BOOK_CACHE_KEY(id));
    return updatedBook;
  },

  removeBook: async (id: string) => {
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Book not found");

    const removedBook = await prisma.book.delete({ where: { id } });

    await invalidateByPattern(BOOKS_CACHE_PATTERN);
    await invalidate(BOOK_CACHE_KEY(id));
    return removedBook;
  },
};
