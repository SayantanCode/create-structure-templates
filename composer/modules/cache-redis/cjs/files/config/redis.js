const { Redis } = require("ioredis");
const { logger } = require("../utils/logger.js");

// lazyConnect: true so the client doesn't start connecting the moment this
// module is required — connectRedis() (wired into loaders/index.js) is
// what actually opens the connection, awaited before the app starts
// accepting requests, same as the database modules.
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

async function connectRedis() {
  await redis.connect();
  logger.info("Redis connected");
}

module.exports = { redis, connectRedis };
