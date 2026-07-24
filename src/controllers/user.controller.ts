import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { userService } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { updateUserSchema } from "../schemas/auth.schema.js";

export const getMe = catchAsync(async (req: Request, res: Response) => {
    // const { id } = req.params as { id: string };
    const user = await userService.getById(req.user.id);
    res.status(200).json(user);
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
    // const { id } = req.params as { id: string };
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Validation error");

    const updatedUser = await userService.patchUser(req.user.id, parsed.data);
    res.status(200).json(updatedUser);
});

export const deleteMe = catchAsync(async (req: Request, res: Response) => {
    // const { id } = req.params as { id: string };
    const deletedUser = await userService.removeUser(req.user.id);
    res.status(200).json(deletedUser);
});