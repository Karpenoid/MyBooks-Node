import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { bookShelfService } from "../services/bookshelf.service.js";
import { ApiError } from "../utils/ApiError.js";
import { bookshelfItemSchema, bookShelfSchema } from "../schemas/bookshelf.schema.js";

export const getShelves = catchAsync(async (req: Request, res: Response) => {
    const shelves = await bookShelfService.getAll(req.user.id);
    res.status(200).json(shelves);
});

export const getShelfById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const shelf = await bookShelfService.getById(id, req.user.id);
    res.status(200).json(shelf);
});

export const postShelf = catchAsync(async (req: Request, res: Response) => {
    const parsed = bookShelfSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
    
    const createdShelf = await bookShelfService.createBookshelf(req.user.id, parsed.data);
    res.status(201).json(createdShelf);
});

export const patchShelf = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const parsed = bookShelfSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");

    const updatedShelf = await bookShelfService.updateBookshelf(id, req.user.id, parsed.data);
    res.status(200).json(updatedShelf);
});

export const deleteShelf = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const deletedShelf = await bookShelfService.removeBookShelf(id, req.user.id);
    res.status(200).json(deletedShelf);
});

export const getShelfItems = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const items = await bookShelfService.getItems(id, req.user.id);
    res.status(200).json(items);
});

export const addShelfItem = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { bookId } = req.body as { bookId: string };
    if (!bookId) throw new ApiError(400, "bookId is required");

    const newItem = await bookShelfService.addItem(id, req.user.id, bookId);
    res.status(201).json(newItem);
});

export const patchShelfItem = catchAsync(async (req: Request, res: Response) => {
    const { id, bookId } = req.params as { id: string; bookId: string };
    const parsed = bookshelfItemSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");

    const updatedItem = await bookShelfService.updateItem(id, bookId, req.user.id, parsed.data);
    res.status(200).json(updatedItem);
});

export const deleteShelfItem = catchAsync(async (req: Request, res: Response) => {
    const { id, bookId } = req.params as { id: string; bookId: string };
    const deletedItem = await bookShelfService.removeItem(id, req.user.id, bookId);
    res.status(200).json(deletedItem);
});
