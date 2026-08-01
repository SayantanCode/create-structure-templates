import { logger } from "../utils/logger.js";

// A worked example — logs a heartbeat once a minute. Replace with real
// scheduled work (cleanup, digests, syncs, ...); add more files the same
// shape and list them in jobs/index.ts.
export const cronExpression = "* * * * *"; // every minute — see https://crontab.guru

export function run(): void {
  logger.info("Heartbeat: app is alive");
}
