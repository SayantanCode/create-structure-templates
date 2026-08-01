// Named import, not the default export — under strict "NodeNext" module
// resolution (as this base uses), ioredis's default-export type doesn't
// narrow to a construct signature and `new Redis(...)` fails to typecheck.
import { Redis } from "ioredis";
import { logger } from "../utils/logger.js";

// lazyConnect: true so the client doesn't start connecting the moment this
// module is imported — connectRedis() (wired into loaders/index.ts) is
// what actually opens the connection, awaited before the app starts
// accepting requests, same as the database modules.
export const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

export async function connectRedis(): Promise<void> {
  await redis.connect();
  logger.info("Redis connected");
}
