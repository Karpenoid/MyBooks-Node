import type { Request, Response } from "express";
import { bookService } from "../services/book.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { bookQuerySchema, bookSchema, updateBookSchema } from "../schemas/book.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const getBooks = catchAsync(async (req: Request, res: Response) => {
  const parsed = bookQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");

  const { page, limit } = parsed.data;
  const books = await bookService.getAll(page, limit);
  res.status(200).json(books);
});

export const getBookById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const book = await bookService.getById(id);
  res.status(200).json(book);
});

export const postBook = catchAsync(async (req: Request, res: Response) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
  }
  const createdBook = await bookService.createBook(parsed.data);
  res.status(201).json(createdBook);
});

export const patchBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const parsed = updateBookSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
  }
  const updatedBook = await bookService.updateBook(id, parsed.data);
  res.status(200).json(updatedBook);
});

export const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const deletedBook = await bookService.removeBook(id);
  res.status(200).json(deletedBook);
});
