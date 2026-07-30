import z from "zod";

export const reviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    comment: z.string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot be more than 500 characters")
    .optional(),
});

export const updateReviewSchema = reviewSchema.partial().refine(
  (data) => data.rating !== undefined || data.comment !== undefined,
  { message: "At least one field must be provided" }
);

export type ReviewDto = z.infer<typeof reviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;