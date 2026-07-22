import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { LoginDto, RegisterDto } from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

export const authService = {
    register: async (data: RegisterDto) => {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing) throw new ApiError(409, "User already exists");

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                passwordHash,
                authProvider: "LOCAL",
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

        return { token, user: { id: user.id, email: user.email, name: user.name } };
    },

    login: async (data: LoginDto) => {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !user.passwordHash) {
            throw new ApiError(401, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

        return { token, user: { id: user.id, email: user.email, name: user.name } };
    }
}