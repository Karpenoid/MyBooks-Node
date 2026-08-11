import z from "zod";

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(4),
  title: z.string().optional(),
  author: z.string().optional(),
  genreIds: z.string().optional(),
});

export const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  description: z.string().optional(),
  releaseDate: z.string().date("Invalid date format (expected YYYY-MM-DD)").optional(),
  pages: z
    .number()
    .int("Pages must be an integer")
    .positive("Pages must be greater than zero")
    .optional(),
  genreIds: z
    .array(z.string().uuid("Invalid genre ID format"))
    .min(1, "At least one genre is required")
    .refine((ids) => new Set(ids).size === ids.length, { message: "Genre IDs must be unique" }),
});

export const updateBookSchema = bookSchema
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type BookQueryDto = z.infer<typeof bookQuerySchema>;
export type BookDto = z.infer<typeof bookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
