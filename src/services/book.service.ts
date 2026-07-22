import { prisma } from "../lib/prisma.js";
import type { BookDto, UpdateBookDto } from "../schemas/book.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const bookService = {
  getAll: async () => {
    const books = await prisma.book.findMany({
      include: { genres: true },
    });

    return books.map((book) => ({
      ...book,
      releaseDate: book.releaseDate?.toISOString().split("T")[0] ?? null,
    }));
  },

  getById: async (id: string) => {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { genres: true },
    });
    if (!book) throw new ApiError(404, "Book not found");
    return book;
  },

  createBook: async (data: BookDto) => {
    const existing = await prisma.book.findFirst({
      where: { title: data.title, author: data.author },
    });
    if (existing) throw new ApiError(409, "Book already exists");

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
      }
    });
    return createdBook;
  },

  updateBook: async (id: string, data: UpdateBookDto) => {
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Book not found");

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
    });
    return updatedBook;
  },

  removeBook: async (id: string) => {
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Book not found");

    const removedBook = await prisma.book.delete({ where: { id } });
    return removedBook;
  }
};