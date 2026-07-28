import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { genreService } from "../services/genre.service.js";
import { genreSchema } from "../schemas/genre.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const getGenres = catchAsync(async (req: Request, res: Response) => {
    const genres = await genreService.getAll();
    res.status(200).json(genres);
});

export const getGenreById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const genre = await genreService.getById(id);
    res.status(200).json(genre);
});

export const postGenre = catchAsync(async (req: Request, res: Response) => {
    const parsed = genreSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
    }
    const createdGenre = await genreService.createGenre(parsed.data);
    res.status(201).json(createdGenre);
});

export const patchGenre = catchAsync( async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const parsed = genreSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
    }
    const updatedGenre = await genreService.updateGenre(id, parsed.data);
    res.status(200).json(updatedGenre);
});

export const deleteGenre = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const deletedGenre = await genreService.removeGenre(id);
    res.status(200).json(deletedGenre);
});
