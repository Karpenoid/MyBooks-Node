import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new ApiError(401, "No token provided");
  const token = authHeader.split(" ")[1];
  if (!token) throw new ApiError(401, "No token provided");

  try {
    const payload = jwt.verify(token, JWT_SECRET!) as unknown as { userId: string };
    req.user = { id: payload.userId, email: "", name: "" };
    next();
  } catch {
    throw new ApiError(401, "Invalid token");
  }
};
