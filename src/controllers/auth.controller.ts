import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { authService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
  }

  const result = await authService.register(parsed.data);
  res.status(201).json(result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");
  }

  const result = await authService.login(parsed.data);
  res.status(200).json(result);
});
