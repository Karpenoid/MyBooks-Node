import { catchAsync } from "../utils/catchAsync.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { reviewService } from "../services/review.service.js";
import { reviewSchema, updateReviewSchema } from "../schemas/review.schema.js";

export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params as { bookId: string };
  const reviews = await reviewService.getAlltoBook(bookId);
  res.status(200).json(reviews);
});

export const getMyReview = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params as { bookId: string };
  const review = await reviewService.getPersonalReview(req.user.id, bookId);
  res.status(200).json(review);
});

export const postReview = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params as { bookId: string };
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success)
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");

  const review = await reviewService.createReview(req.user.id, bookId, parsed.data);
  res.status(201).json(review);
});

export const patchReview = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params as { bookId: string };
  const parsed = updateReviewSchema.safeParse(req.body);
  if (!parsed.success)
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");

  const review = await reviewService.updateReview(req.user.id, bookId, parsed.data);
  res.status(200).json(review);
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params as { bookId: string };
  const deletedReview = await reviewService.removeReview(req.user.id, bookId);
  res.status(200).json(deletedReview);
});
