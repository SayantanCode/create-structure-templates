import { Redis } from "ioredis";

// BullMQ requires its own dedicated connection with maxRetriesPerRequest
// set to null (needed for its blocking commands) — this can't be shared
// with the cache-redis module's client, which sets a normal retry limit.
// Both the API process (enqueueing jobs, via queues/email.queue.ts) and
// the standalone worker process (workers/email.worker.ts) construct a
// BullMQ Queue/Worker against this same connection.
//
// Deliberately no explicit `.connect()` call anywhere in this module:
// BullMQ's Queue/Worker start using this connection themselves the
// moment they're constructed (which is what actually opens it, since
// lazyConnect delays connecting until first use, not until asked to).
// Calling `.connect()` ourselves too would race with that and throw
// "Redis is already connecting/connected". Wherever you need to wait for
// this connection specifically, call `.waitUntilReady()` on the Queue or
// Worker instance instead (see loaders/index.ts and worker.ts).
export const queueConnection = new Redis(
  process.env.QUEUE_REDIS_URL || process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { lazyConnect: true, maxRetriesPerRequest: null }
);
