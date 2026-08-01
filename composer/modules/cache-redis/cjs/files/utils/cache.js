const { redis } = require("../config/redis.js");

// Thin JSON-aware wrapper around the raw ioredis client — reach for these
// instead of calling redis.get/set directly so callers don't have to
// remember to JSON.stringify/parse every value by hand.
const cache = {
  async get(key) {
    const raw = await redis.get(key);
    return raw === null ? null : JSON.parse(raw);
  },

  async set(key, value, ttlSeconds) {
    const raw = JSON.stringify(value);
    if (ttlSeconds) await redis.set(key, raw, "EX", ttlSeconds);
    else await redis.set(key, raw);
  },

  async del(key) {
    await redis.del(key);
  },

  // Cache-aside helper: returns the cached value if present, otherwise
  // calls `fn`, caches whatever it resolves to, and returns that. Typical
  // use: `const user = await cache.getOrSet(`user:${id}`, 60, () => db.findUser(id));`
  async getOrSet(key, ttlSeconds, fn) {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    const fresh = await fn();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  },
};

module.exports = { cache };
