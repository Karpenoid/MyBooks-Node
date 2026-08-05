import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { GenreDto } from "../schemas/genre.schema.js";
import { BOOK_DETAIL_CACHE_PATTERN, BOOKS_CACHE_PATTERN } from "./book.service.js";
import { cached, invalidate, invalidateByPattern } from "../utils/redisWrap.js";

const CACHE_TTL = 60 * 60;
const GENRES_CACHE_KEY = "genres:all";
const GENRE_CACHE_KEY = (id: string) => `genres:${id}`;

export const genreService = {
  getAll: async () => {
    return cached(GENRES_CACHE_KEY, CACHE_TTL, async () => {
      const genres = await prisma.genre.findMany();
      return genres;
    });
  },

  getById: async (id: string) => {
    return cached(GENRE_CACHE_KEY(id), CACHE_TTL, async () => {
      const genre = await prisma.genre.findUnique({ where: { id } });
      if (!genre) throw new ApiError(404, "Genre not found");
      return genre;
    });
  },

  createGenre: async (data: GenreDto) => {
    const existing = await prisma.genre.findUnique({ where: { name: data.name } });
    if (existing) throw new ApiError(409, "Genre already exists");

    const createdGenre = await prisma.genre.create({ data });

    await invalidate(GENRES_CACHE_KEY);
    return createdGenre;
  },

  updateGenre: async (id: string, data: GenreDto) => {
    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Genre not found");

    const updatedGenre = await prisma.genre.update({ where: { id }, data });

    await invalidate(GENRES_CACHE_KEY);
    await invalidate(GENRE_CACHE_KEY(id));
    await invalidateByPattern(BOOKS_CACHE_PATTERN);
    await invalidateByPattern(BOOK_DETAIL_CACHE_PATTERN);
    return updatedGenre;
  },

  removeGenre: async (id: string) => {
    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Genre not found");

    const deletedGenre = await prisma.genre.delete({ where: { id } });

    await invalidate(GENRES_CACHE_KEY);
    await invalidate(GENRE_CACHE_KEY(id));
    await invalidateByPattern(BOOKS_CACHE_PATTERN);
    await invalidateByPattern(BOOK_DETAIL_CACHE_PATTERN);
    return deletedGenre;
  },
};
