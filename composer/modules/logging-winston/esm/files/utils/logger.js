import winston from "winston";

// Winston has no built-in "fatal" level, so we add one above "error" —
// server.js's unrecoverable-bootstrap-failure log gets its own level
// instead of being indistinguishable from a normal request-time error.
const levels = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4 };
winston.addColors({ fatal: "red", error: "red", warn: "yellow", info: "green", debug: "blue" });

const isProd = process.env.NODE_ENV === "production";

// Plain structured JSON in production — what log aggregators (Datadog,
// CloudWatch, ...) actually want to ingest; colorized single-line output
// in development.
const base = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || "info",
  format: isProd
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `[${timestamp}] ${level}: ${message}${rest}`;
        })
      ),
  transports: [new winston.transports.Console()],
});

// The rest of this project calls logger.error({ err }, "message") and
// logger.fatal(err, "message") — pino's "object/error argument first"
// call style, so that every module built against `logger` (database
// connectors, the realtime server, ...) works unchanged no matter which
// logging library you picked. This wrapper normalizes both call shapes
// onto Winston's own (message, meta) signature. Error objects don't
// survive JSON.stringify on their own (message/stack are non-enumerable),
// so we pull those out into plain fields — otherwise a crash would log
// as an empty `{}` with no stack trace to debug it from.
function normalize(a, b) {
  if (typeof a === "string" && b === undefined) return [a, {}];
  const err = a instanceof Error ? a : a?.err;
  const meta = a instanceof Error ? {} : { ...a };
  if (err instanceof Error) meta.err = { name: err.name, message: err.message, stack: err.stack };
  return [b ?? err?.message ?? String(a), meta];
}

export const logger = {
  fatal: (a, b) => {
    const [message, meta] = normalize(a, b);
    base.log("fatal", message, meta);
  },
  error: (a, b) => {
    const [message, meta] = normalize(a, b);
    base.log("error", message, meta);
  },
  warn: (message, meta) => base.warn(message, meta),
  info: (message, meta) => base.info(message, meta),
  debug: (message, meta) => base.debug(message, meta),
};
