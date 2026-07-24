import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { UpdateUserDto } from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";

export const userService = {
    getById: async (id: string) => {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                authProvider: true,
                createdAt: true,
            },
        });
        if (!user) throw new ApiError(404, "User not found");
        return user;
    },

    patchUser: async (id: string, data: UpdateUserDto) => {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) throw new ApiError(404, "User not found");

        const passwordHash = data.password !== undefined
            ? await bcrypt.hash(data.password, 10)
            : undefined;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(data.email !== undefined && { email: data.email }),
                ...(data.name !== undefined && { name: data.name }),
                ...(passwordHash !== undefined && { passwordHash }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                authProvider: true,
                createdAt: true,
            },
        });
        return updatedUser;
    },

    removeUser: async (id: string) => {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) throw new ApiError(404, "User not found");

        const deletedUser = await prisma.user.delete({ 
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                authProvider: true,
                createdAt: true,
            },
        });
        return deletedUser;
    }
};