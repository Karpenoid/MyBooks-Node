import { prisma } from "../lib/prisma.js";

export const bookService = {
  getAll: async () => {
    return prisma.book.findMany({
      include: { genres: true },
    });
  },
};