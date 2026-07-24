import { Router } from "express";
import bookRouter from "./book.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/books", bookRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;