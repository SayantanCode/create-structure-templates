import pino from "pino";

// Pretty, colorized output in development; plain structured JSON in
// production — what log aggregators (Datadog, CloudWatch, ...) actually
// want to ingest, and what `pino-http`'s per-request req.log inherits too.
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" } },
});
