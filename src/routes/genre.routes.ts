import { Router } from "express";
import {
  deleteGenre,
  getGenreById,
  getGenres,
  patchGenre,
  postGenre,
} from "../controllers/genre.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", getGenres);
router.get("/:id", getGenreById);
router.post("/", authMiddleware, postGenre);
router.patch("/:id", authMiddleware, patchGenre);
router.delete("/:id", authMiddleware, deleteGenre);

export default router;
