const { schedule } = require("node-cron");
const heartbeat = require("./heartbeat.job.js");

// Every job file exports `cronExpression` and `run()` — add a new job by
// creating a file the same shape and listing it here.
const jobs = [heartbeat];

const tasks = [];

// Starts every registered job. Called once from loaders/index.js, after
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
function registerJobs() {
  for (const job of jobs) {
    tasks.push(schedule(job.cronExpression, job.run));
  }
}

function stopJobs() {
  for (const task of tasks) task.stop();
}

module.exports = { registerJobs, stopJobs };
