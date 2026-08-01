const { Worker } = require("bullmq");
const { queueConnection } = require("../config/queue.js");
const { logger } = require("../utils/logger.js");

// Processes jobs added to the "email" queue. This runs in the standalone
// worker process (worker.js), not the API process — see worker.js and
// this project's README for why they're kept separate.
const emailWorker = new Worker(
  "email",
  async (job) => {
    logger.info({ data: job.data }, `Processing job ${job.id} (${job.name})`);
    // TODO: replace with real email-sending logic. Throw here to trigger
    // a retry, per the attempts/backoff options set in queues/email.queue.js.
  },
  { connection: queueConnection }
);

emailWorker.on("completed", (job) => logger.info(`Job ${job.id} completed`));
emailWorker.on("failed", (job, err) => logger.error({ err }, `Job ${job?.id} failed`));

module.exports = { emailWorker };
