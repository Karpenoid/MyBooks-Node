import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { GenreDto } from "../schemas/genre.schema.js";

export const genreService = {
    getAll: async () => {
        const genres = await prisma.genre.findMany();
        return genres;
    },

    getById: async (id: string) => {
        const genre = await prisma.genre.findUnique({ where: { id } });
        if (!genre) throw new ApiError(404, "Genre not found");
        return genre;
    },

    createGenre: async (data: GenreDto) => {
        const existing = await prisma.genre.findUnique({ where: { name: data.name } });
        if (existing) throw new ApiError(409, "Genre already exists");

        const createdGenre = await prisma.genre.create({ data });
        return createdGenre;
    },

    updateGenre: async (id: string, data: GenreDto) => {
        const existing = await prisma.genre.findUnique({ where: { id } });
        if (!existing) throw new ApiError(404, "Genre not found");

        const updatedGenre = await prisma.genre.update({ where: { id }, data });
        return updatedGenre;
    },

    removeGenre: async (id: string) => {
        const existing = await prisma.genre.findUnique({ where: { id } });
        if (!existing) throw new ApiError(404, "Genre not found");

        const deletedGenre = await prisma.genre.delete({ where: {id} });
        return deletedGenre;
    }
}