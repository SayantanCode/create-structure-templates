import { Worker } from "bullmq";
import { queueConnection } from "../config/queue.js";
import { logger } from "../utils/logger.js";
import type { EmailJobData } from "../queues/email.queue.js";

// Processes jobs added to the "email" queue. This runs in the standalone
// worker process (worker.ts), not the API process — see worker.ts and
// this project's README for why they're kept separate.
export const emailWorker = new Worker<EmailJobData>(
  "email",
  async (job) => {
    logger.info({ data: job.data }, `Processing job ${job.id} (${job.name})`);
    // TODO: replace with real email-sending logic. Throw here to trigger
    // a retry, per the attempts/backoff options set in queues/email.queue.ts.
  },
  { connection: queueConnection }
);

emailWorker.on("completed", (job) => logger.info(`Job ${job.id} completed`));
emailWorker.on("failed", (job, err) => logger.error({ err }, `Job ${job?.id} failed`));
