import { Router } from "express";
import bookRouter from "./book.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import genreRouter from "./genre.routes.js";
import bookshelfRouter from "./bookshelf.routes.js";

const router = Router();

router.use("/books", bookRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/genres", genreRouter);
router.use("/bookshelves", bookshelfRouter);

export default router;