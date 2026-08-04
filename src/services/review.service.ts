import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { ReviewDto, UpdateReviewDto } from "../schemas/review.schema.js";

export const reviewService = {
  getAlltoBook: async (bookId: string) => {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new ApiError(404, "Book not found");

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: { user: { select: { id: true, name: true } } },
    });
    return reviews;
  },

  getPersonalReview: async (userId: string, bookId: string) => {
    const review = await prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (!review) throw new ApiError(404, "Review not found");
    return review;
  },

  createReview: async (userId: string, bookId: string, data: ReviewDto) => {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new ApiError(404, "Book not found");

    const existing = await prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (existing) throw new ApiError(409, "Review already exists for this book by this user");

    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating: data.rating,
        ...(data.comment !== undefined && { comment: data.comment }),
      },
    });
    return review;
  },

  updateReview: async (userId: string, bookId: string, data: UpdateReviewDto) => {
    const existing = await prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (!existing) throw new ApiError(404, "Review not found");

    const updatedReview = await prisma.review.update({
      where: { userId_bookId: { userId, bookId } },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
      },
    });
    return updatedReview;
  },

  removeReview: async (userId: string, bookId: string) => {
    const existing = await prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (!existing) throw new ApiError(404, "Review not found");

    const removedReview = await prisma.review.delete({
      where: { userId_bookId: { userId, bookId } },
    });
    return removedReview;
  },
};
