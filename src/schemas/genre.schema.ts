import z from "zod";

export const genreSchema = z.object({
    name: z.string().min(2, "Genre name must be at least 2 characters"),
});

export type GenreDto = z.infer<typeof genreSchema>;