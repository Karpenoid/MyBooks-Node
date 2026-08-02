import { Router } from "express";
import bookRouter from "./book.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import genreRouter from "./genre.routes.js";
import bookshelfRouter from "./bookshelf.routes.js";
import reviewRouter from "./review.routes.js";
import { requestLimit } from "../middlewares/ratelimit.middleware.js";

const router = Router();
router.use(requestLimit)

router.use("/books", bookRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/genres", genreRouter);
router.use("/bookshelves", bookshelfRouter);
router.use("/books/:bookId/reviews", reviewRouter);

export default router;