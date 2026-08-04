import { prisma } from "../lib/prisma.js";
import { redisClient } from "../lib/redis.js";
import type { BookDto, UpdateBookDto } from "../schemas/book.schema.js";
import { ApiError } from "../utils/ApiError.js";

const CACHE_TTL = 60 * 5;
export const BOOKS_CACHE_KEY = "books:all";
const BOOK_CACHE_KEY = (id: string) => `books:${id}`;

export const bookService = {
  getAll: async () => {
    const cached = await redisClient.get(BOOKS_CACHE_KEY);
    if (cached) return JSON.parse(cached);
    
    const books = await prisma.book.findMany({
      include: { genres: true },
    });

    const result = books.map((book) => ({
      ...book,
      releaseDate: book.releaseDate?.toISOString().split("T")[0] ?? null,
    }));

    await redisClient.set(BOOKS_CACHE_KEY, JSON.stringify(result), { EX: CACHE_TTL });
    return result;
  },

  getById: async (id: string) => {
    const cached = await redisClient.get(BOOK_CACHE_KEY(id));
    if (cached) return JSON.parse(cached);

    const book = await prisma.book.findUnique({
      where: { id },
      include: { genres: true },
    });
    if (!book) throw new ApiError(404, "Book not found");

    const result = {
      ...book,
      releaseDate: book.releaseDate?.toISOString().split("T")[0] ?? null,
    };

    await redisClient.set(BOOK_CACHE_KEY(id), JSON.stringify(result), { EX: CACHE_TTL });
    return result;
  },

  createBook: async (data: BookDto) => {
    const existing = await prisma.book.findFirst({
      where: { title: data.title, author: data.author },
    });
    if (existing) throw new ApiError(409, "Book already exists");

    const genres = await prisma.genre.findMany({
      where: { id: { in: data.genreIds } },
    });
    if (genres.length !== data.genreIds.length) throw new ApiError(404, "One or more genres not found");

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

    await redisClient.del(BOOKS_CACHE_KEY);
    return createdBook;
  },

  updateBook: async (id: string, data: UpdateBookDto) => {
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Book not found");

    if (data.genreIds !== undefined) {
      const genres = await prisma.genre.findMany({
        where: { id: { in: data.genreIds } },
      });
      if (genres.length !== data.genreIds.length) throw new ApiError(404, "One or more genres not found");
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

    await redisClient.del(BOOKS_CACHE_KEY);
    await redisClient.del(BOOK_CACHE_KEY(id));
    return updatedBook;
  },

  removeBook: async (id: string) => {
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Book not found");

    const removedBook = await prisma.book.delete({ where: { id } });

    await redisClient.del(BOOKS_CACHE_KEY);
    await redisClient.del(BOOK_CACHE_KEY(id));
    return removedBook;
  }
};