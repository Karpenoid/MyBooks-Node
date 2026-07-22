import { Router } from "express";
import { deleteBook, getBookById, getBooks, patchBook, postBook } from "../controllers/book.controller.js";

const router = Router();
router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", postBook);
router.patch("/:id", patchBook);
router.delete("/:id", deleteBook);

export default router;