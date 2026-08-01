import { schedule, type ScheduledTask } from "node-cron";
import * as heartbeat from "./heartbeat.job.js";

interface CronJob {
  cronExpression: string;
  run: () => void;
}

// Every job file exports `cronExpression` and `run()` — add a new job by
// creating a file the same shape and listing it here.
const jobs: CronJob[] = [heartbeat];

const tasks: ScheduledTask[] = [];

// Starts every registered job. Called once from loaders/index.ts, after
// everything else has finished connecting — a job firing before the
// database/cache/queue are ready could crash or silently no-op.
//
// Running more than one instance of this API? node-cron runs in-process,
// so N horizontally-scaled instances means the same job fires N times on
// the same schedule (duplicate emails, double-run cleanups, ...). If
// that's a real risk here, pass `{ distributed: true }` to schedule()
// below and wire up a coordinator — see
// https://nodecron.com/distributed-coordination (node-cron ships the
// `distributed` option and a pluggable RunCoordinator interface for
// exactly this). The queue-bullmq module is the other option: its
// repeatable jobs coordinate through Redis by design, so they never
// double-fire across instances either.
export function registerJobs(): void {
  for (const job of jobs) {
    tasks.push(schedule(job.cronExpression, job.run));
  }
}

export function stopJobs(): void {
  for (const task of tasks) task.stop();
}
