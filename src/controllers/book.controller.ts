import type { Request, Response } from "express";
import { bookService } from "../services/book.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getBooks = catchAsync(async (req: Request, res: Response) => {
  const books = await bookService.getAll();
  res.status(200).json(books);
});