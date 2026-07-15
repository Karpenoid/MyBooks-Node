import { prisma } from "../lib/prisma.js";

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
};