import "dotenv/config";
import { logger } from "./utils/logger.js";
import { emailWorker } from "./workers/email.worker.js";

// Standalone entrypoint for the background-job process — deliberately
// separate from server.js. Running workers in a different process (and
// usually a different deployment) than the API means a slow or stuck job
// never blocks an HTTP response, and you can scale the two independently.
// For local dev, run this in a second terminal alongside `npm run dev`.
async function bootstrap() {
  // emailWorker started connecting (and listening) the moment it was
  // constructed above — this just waits for that to finish before we log
  // "ready". See config/queue.js for why there's no separate connect() call.
  await emailWorker.waitUntilReady();
  logger.info("Worker ready, listening for jobs...");

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down worker gracefully...`);
    // Worker.close() waits for any in-progress job to finish first,
    // instead of killing it mid-run.
    await emailWorker.close();
    process.exit(0);
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  logger.fatal(err, "Fatal worker bootstrap error");
  process.exit(1);
});
