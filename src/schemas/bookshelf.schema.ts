import z from "zod";
import { ReadStatus } from "@prisma/client";

export const bookShelfSchema = z.object({
  name: z.string().min(1, "Bookshelf name must be at least 1 letter"),
});

export const bookshelfItemSchema = z
  .object({
    readStatus: z.nativeEnum(ReadStatus).optional(),
    isFavorite: z.boolean().optional(),
  })
  .refine((data) => data.readStatus !== undefined || data.isFavorite !== undefined, {
    message: "At least one field must be provided",
  });

export type BookShelfDto = z.infer<typeof bookShelfSchema>;
export type BookshelfItemDto = z.infer<typeof bookshelfItemSchema>;
