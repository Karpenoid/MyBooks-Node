import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) throw new Error("REDIS_URL is not set");

export const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis error:", err));