import { redis } from "../config/redis.js";

// Thin JSON-aware wrapper around the raw ioredis client — reach for these
// instead of calling redis.get/set directly so callers don't have to
// remember to JSON.stringify/parse every value by hand.
export const cache = {
  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const raw = JSON.stringify(value);
    if (ttlSeconds) await redis.set(key, raw, "EX", ttlSeconds);
    else await redis.set(key, raw);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  // Cache-aside helper: returns the cached value if present, otherwise
  // calls `fn`, caches whatever it resolves to, and returns that. Typical
  // use: `const user = await cache.getOrSet(`user:${id}`, 60, () => db.findUser(id));`
  async getOrSet<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await fn();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  },
};
