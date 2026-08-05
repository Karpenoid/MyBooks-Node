import { prisma } from "../lib/prisma.js";
import type { BookShelfDto, BookshelfItemDto } from "../schemas/bookshelf.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const bookShelfService = {
  getAll: async (userId: string) => {
    const bookshelves = await prisma.bookshelf.findMany({
      where: { userId },
      include: { items: true },
    });
    return bookshelves;
  },

  getById: async (id: string, userId: string) => {
    const bookshelf = await prisma.bookshelf.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!bookshelf) throw new ApiError(404, "Bookshelf not found");
    if (bookshelf.userId !== userId) throw new ApiError(403, "Forbidden");
    return bookshelf;
  },

  createBookshelf: async (userId: string, data: BookShelfDto) => {
    const existing = await prisma.bookshelf.findFirst({
      where: { name: data.name, userId },
    });
    if (existing) throw new ApiError(409, "Bookshelf with this name already exists");
    const bookshelf = await prisma.bookshelf.create({
      data: {
        name: data.name,
        userId,
      },
    });
    return bookshelf;
  },

  updateBookshelf: async (id: string, userId: string, data: BookShelfDto) => {
    const existing = await prisma.bookshelf.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Bookshelf not found");
    if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

    const updatedBookshelf = await prisma.bookshelf.update({ where: { id }, data });
    return updatedBookshelf;
  },

  removeBookShelf: async (id: string, userId: string) => {
    const existing = await prisma.bookshelf.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Bookshelf not found");
    if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

    const deletedBookshelf = await prisma.bookshelf.delete({ where: { id } });
    return deletedBookshelf;
  },

  getItems: async (id: string, userId: string) => {
    const existing = await prisma.bookshelf.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Bookshelf not found");
    if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

    const items = await prisma.bookshelfItem.findMany({
      where: { bookshelfId: id },
      include: { book: true },
    });
    return items;
  },

  addItem: async (id: string, userId: string, bookId: string) => {
    const existing = await prisma.bookshelf.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Bookshelf not found");
    if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new ApiError(404, "Book not found");

    const existingItem = await prisma.bookshelfItem.findUnique({
      where: { bookshelfId_bookId: { bookshelfId: id, bookId } },
    });
    if (existingItem) throw new ApiError(409, "This book is already on the bookshelf");

    const newItem = await prisma.bookshelfItem.create({ data: { bookshelfId: id, bookId } });
    return newItem;
  },

  updateItem: async (id: string, bookId: string, userId: string, data: BookshelfItemDto) => {
    const existing = await prisma.bookshelf.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Bookshelf not found");
    if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

    const item = await prisma.bookshelfItem.findUnique({
      where: { bookshelfId_bookId: { bookshelfId: id, bookId } },
    });
    if (!item) throw new ApiError(404, "Book not found in this bookshelf");

    const updatedItem = await prisma.bookshelfItem.update({
      where: { bookshelfId_bookId: { bookshelfId: id, bookId } },
      data: {
        ...(data.readStatus !== undefined && { readStatus: data.readStatus }),
        ...(data.isFavorite !== undefined && { isFavorite: data.isFavorite }),
      },
      include: { book: true },
    });
    return updatedItem;
  },

  removeItem: async (id: string, bookId: string, userId: string) => {
    const existing = await prisma.bookshelf.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Bookshelf not found");
    if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

    const book = await prisma.bookshelfItem.findUnique({
      where: { bookshelfId_bookId: { bookshelfId: id, bookId } },
    });
    if (!book) throw new ApiError(404, "Book not found in this bookshelf");

    const removedItem = await prisma.bookshelfItem.delete({
      where: { bookshelfId_bookId: { bookshelfId: id, bookId } },
    });
    return removedItem;
  },
};
