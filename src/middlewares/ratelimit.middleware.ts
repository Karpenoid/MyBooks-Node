import { rateLimit } from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many requests for auth, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const requestLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
