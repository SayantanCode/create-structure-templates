import { Queue, type JobsOptions } from "bullmq";
import { queueConnection } from "../config/queue.js";

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

// One BullMQ Queue per job type is the usual convention — this "email"
// queue is a worked example. Add more queues/workers the same way for
// other background jobs (image processing, report generation, ...).
export const emailQueue = new Queue<EmailJobData>("email", { connection: queueConnection });

// Producer-side helper — call this from a route/service instead of
// reaching for `emailQueue.add(...)` directly everywhere.
export function enqueueEmail(payload: EmailJobData, options: JobsOptions = {}) {
  return emailQueue.add("send-email", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 500,
    ...options,
  });
}
