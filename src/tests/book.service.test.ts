import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Prisma, Book } from "@prisma/client";

type BookWithGenres = Prisma.BookGetPayload<{
  include: { genres: true };
}>;

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    book: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    genre: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../utils/redisWrap.js", () => ({
  cached: vi.fn((_key: string, _ttl: number, fetcher: () => Promise<unknown>) => fetcher()),
  invalidate: vi.fn(),
  invalidateByPattern: vi.fn(),
}));

import { bookService } from "../services/book.service.js";
import { prisma } from "../lib/prisma.js";

describe("bookService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return books with metadata", async () => {
      vi.mocked(prisma.book.findMany).mockResolvedValue([
        {
          id: "uuid-1",
          title: "Dune",
          author: "Frank Herbert",
          description: null,
          releaseDate: null,
          pages: 688,
          genres: [],
        } as BookWithGenres,
      ]);
      vi.mocked(prisma.book.count).mockResolvedValue(1);

      const result = await bookService.getAll({ page: 1, limit: 4 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.page).toBe(1);
    });
  });

  describe("getById", () => {
    it("should throw 404 if book is not found", async () => {
      vi.mocked(prisma.book.findUnique).mockResolvedValue(null);

      await expect(bookService.getById("non-existent-id")).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it("should return book if found", async () => {
      vi.mocked(prisma.book.findUnique).mockResolvedValue({
        id: "uuid-1",
        title: "Dune",
        author: "Frank Herbert",
        description: null,
        releaseDate: null,
        pages: 688,
        genres: [],
      } as BookWithGenres);

      const result = await bookService.getById("uuid-1");

      expect(result.title).toBe("Dune");
    });
  });

  describe("createBook", () => {
    it("should throw 409 if book already exists", async () => {
      vi.mocked(prisma.book.findFirst).mockResolvedValue({
        id: "uuid-1",
        title: "Dune",
        author: "Frank Herbert",
        description: null,
        releaseDate: null,
        pages: 688,
      } as Book);

      await expect(
        bookService.createBook({
          title: "Dune",
          author: "Frank Herbert",
          genreIds: ["genre-uuid"],
        }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("should throw 404 if genre does not exist", async () => {
      vi.mocked(prisma.book.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.genre.findMany).mockResolvedValue([]);

      await expect(
        bookService.createBook({
          title: "Dune",
          author: "Frank Herbert",
          genreIds: ["non-existent-genre"],
        }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
