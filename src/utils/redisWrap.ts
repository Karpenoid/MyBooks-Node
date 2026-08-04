import { redisClient } from "../lib/redis.js";

export async function cached<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>
): Promise<T> {
    try {
        const hit = await redisClient.get(key);
        if (hit) return JSON.parse(hit);
    } catch (err) {
        console.error(`Redis get failed for ${key}:`, err);
    }

    const fresh = await fetcher();

    try {
        await redisClient.set(key, JSON.stringify(fresh), { EX: ttlSeconds });
    } catch (err) {
        console.error(`Redis set failed for ${key}:`, err);
    }

    return fresh;
}

export async function invalidate(...keys: string[]) {
    try {
        await Promise.all(keys.map((key) => redisClient.del(key)));
    } catch (err) {
        console.error("Redis invalidate failed:", err);
    }
}