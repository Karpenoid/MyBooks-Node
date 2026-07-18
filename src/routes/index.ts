import { Router } from "express";
import bookRouter from "./book.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.use("/books", bookRouter);
router.use("/auth", authRouter);

export default router;