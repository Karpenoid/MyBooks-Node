import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import { authService } from "../services/auth.service.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "secret_key_for_tests";
  });

  describe("register", () => {
    it("should throw 409 if email already exists", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "uuid-1",
        email: "test@test.com",
        name: "Test",
        passwordHash: null,
        authProvider: "LOCAL",
        providerId: null,
        createdAt: new Date(),
      });

      await expect(
        authService.register({
          email: "test@test.com",
          name: "Test",
          password: "123456",
        })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("should create user and return token", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed_password" as never);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: "uuid-123",
        email: "test@test.com",
        name: "Test",
        passwordHash: "hashed_password",
        authProvider: "LOCAL",
        providerId: null,
        createdAt: new Date(),
      });

      const result = await authService.register({
        email: "test@test.com",
        name: "Test",
        password: "123456",
      });

      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("test@test.com");
      expect(result.user).not.toHaveProperty("passwordHash");
    });
  });

  describe("login", () => {
    it("should throw 401 if user is not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        authService.login({ email: "notexist@test.com", password: "123456" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("should throw 401 if password is incorrect", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "uuid-1",
        email: "test@test.com",
        name: "Test",
        passwordHash: "hashed_password",
        authProvider: "LOCAL",
        providerId: null,
        createdAt: new Date(),
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({ email: "test@test.com", password: "wrongpassword" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("should return token with valid credentials", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "uuid-1",
        email: "test@test.com",
        name: "Test",
        passwordHash: "hashed_password",
        authProvider: "LOCAL",
        providerId: null,
        createdAt: new Date(),
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await authService.login({
        email: "test@test.com",
        password: "123456",
      });

      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("test@test.com");
    });
  });
});