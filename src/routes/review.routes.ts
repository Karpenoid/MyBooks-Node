import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getReviews,
  getMyReview,
  postReview,
  patchReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router({ mergeParams: true });

router.get("/", getReviews);
router.get("/my", authMiddleware, getMyReview);
router.post("/", authMiddleware, postReview);
router.patch("/", authMiddleware, patchReview);
router.delete("/", authMiddleware, deleteReview);

export default router;