import { Router } from "express";
import {
  deleteBook,
  getBookById,
  getBooks,
  patchBook,
  postBook,
} from "../controllers/book.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", authMiddleware, postBook);
router.patch("/:id", authMiddleware, patchBook);
router.delete("/:id", authMiddleware, deleteBook);

export default router;
