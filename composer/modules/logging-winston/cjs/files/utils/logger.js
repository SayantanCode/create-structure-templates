const winston = require("winston");

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

// Every level here accepts pino's own two call shapes — logger.info("msg")
// and logger.error({ err }, "msg") / logger.fatal(err, "msg") (merging
// object or error argument first, message second) — so every module built
// against `logger` (database connectors, the realtime server, background
// workers, ...) works unchanged no matter which logging library you
// picked, and so this logger behaves like pino would if code elsewhere
// calls it with metadata at any level, not just error/fatal. Error
// objects don't survive JSON.stringify on their own (message/stack are
// non-enumerable), so we pull those out into plain fields — otherwise a
// crash would log as an empty `{}` with no stack trace to debug it from.
function normalize(a, b) {
  if (typeof a === "string") return [a, {}];
  const err = a instanceof Error ? a : a?.err;
  const meta = a instanceof Error ? {} : { ...a };
  if (err instanceof Error) meta.err = { name: err.name, message: err.message, stack: err.stack };
  return [b ?? err?.message ?? String(a), meta];
}

function log(level, a, b) {
  const [message, meta] = normalize(a, b);
  base.log(level, message, meta);
}

const logger = {
  fatal: (a, b) => log("fatal", a, b),
  error: (a, b) => log("error", a, b),
  warn: (a, b) => log("warn", a, b),
  info: (a, b) => log("info", a, b),
  debug: (a, b) => log("debug", a, b),
};

module.exports = { logger };
