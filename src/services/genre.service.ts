import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { GenreDto } from "../schemas/genre.schema.js";
import { redisClient } from "../lib/redis.js";
import { BOOKS_CACHE_KEY } from "./book.service.js";

const CACHE_TTL = 60 * 60;
const GENRES_CACHE_KEY = "genres:all";
const GENRE_CACHE_KEY = (id: string) => `genres:${id}`;

export const genreService = {
    getAll: async () => {
        const cached = await redisClient.get(GENRES_CACHE_KEY);
        if (cached) return JSON.parse(cached);
    
        const genres = await prisma.genre.findMany();

        await redisClient.set(GENRES_CACHE_KEY, JSON.stringify(genres), { EX: CACHE_TTL });
        return genres;
    },

    getById: async (id: string) => {
        const cached = await redisClient.get(GENRE_CACHE_KEY(id));
        if (cached) return JSON.parse(cached);

        const genre = await prisma.genre.findUnique({ where: { id } });
        if (!genre) throw new ApiError(404, "Genre not found");

        await redisClient.set(GENRE_CACHE_KEY(id), JSON.stringify(genre), { EX: CACHE_TTL });
        return genre;
    },

    createGenre: async (data: GenreDto) => {
        const existing = await prisma.genre.findUnique({ where: { name: data.name } });
        if (existing) throw new ApiError(409, "Genre already exists");

        const createdGenre = await prisma.genre.create({ data });

        await redisClient.del(GENRES_CACHE_KEY);
        return createdGenre;
    },

    updateGenre: async (id: string, data: GenreDto) => {
        const existing = await prisma.genre.findUnique({ where: { id } });
        if (!existing) throw new ApiError(404, "Genre not found");

        const updatedGenre = await prisma.genre.update({ where: { id }, data });

        await redisClient.del(GENRES_CACHE_KEY);
        await redisClient.del(GENRE_CACHE_KEY(id));
        await redisClient.del(BOOKS_CACHE_KEY);
        return updatedGenre;
    },

    removeGenre: async (id: string) => {
        const existing = await prisma.genre.findUnique({ where: { id } });
        if (!existing) throw new ApiError(404, "Genre not found");

        const deletedGenre = await prisma.genre.delete({ where: {id} });

        await redisClient.del(GENRES_CACHE_KEY);
        await redisClient.del(GENRE_CACHE_KEY(id));
        await redisClient.del(BOOKS_CACHE_KEY);
        return deletedGenre;
    }
}