import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addShelfItem,
  deleteShelf,
  deleteShelfItem,
  getShelfById,
  getShelfItems,
  getShelves,
  patchShelf,
  patchShelfItem,
  postShelf,
} from "../controllers/bookshelf.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/", getShelves);
router.get("/:id", getShelfById);
router.post("/", postShelf);
router.patch("/:id", patchShelf);
router.delete("/:id", deleteShelf);

router.get("/:id/items", getShelfItems);
router.post("/:id/items", addShelfItem);
router.patch("/:id/items/:bookId", patchShelfItem);
router.delete("/:id/items/:bookId", deleteShelfItem);

export default router;
