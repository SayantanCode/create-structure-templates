import { Queue } from "bullmq";
import { queueConnection } from "../config/queue.js";

// One BullMQ Queue per job type is the usual convention — this "email"
// queue is a worked example. Add more queues/workers the same way for
// other background jobs (image processing, report generation, ...).
export const emailQueue = new Queue("email", { connection: queueConnection });

// Producer-side helper — call this from a route/service instead of
// reaching for `emailQueue.add(...)` directly everywhere. Expects
// payload shaped like `{ to, subject, body }`, matching workers/email.worker.js.
export function enqueueEmail(payload, options = {}) {
  return emailQueue.add("send-email", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 500,
    ...options,
  });
}
