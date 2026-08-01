type LogLevel = "fatal" | "error" | "warn" | "info" | "debug";
type LogMeta = Record<string, unknown>;

const LEVELS: LogLevel[] = ["fatal", "error", "warn", "info", "debug"];
const configuredLevel = (process.env.LOG_LEVEL || "info").toLowerCase();
const levelIndex = LEVELS.includes(configuredLevel as LogLevel) ? LEVELS.indexOf(configuredLevel as LogLevel) : LEVELS.indexOf("info");
const isProd = process.env.NODE_ENV === "production";

// Minimal, zero-dependency logger — this is what you get if you picked
// "None" in the "logging" dimension (Pino is the default there, Winston
// the alternative). Every module in this project that logs anything
// (database connectors, the realtime server, background workers, ...)
// calls `logger` with pino's own "merging object or error argument
// first, message second" shape — logger.info("msg") and
// logger.error({ err }, "msg") / logger.fatal(err, "msg") — so this
// keeps that same contract even though it's plain console output
// underneath. Swap this file for whatever logging setup you actually
// want; nothing else needs to change as long as
// logger.info/warn/error/fatal/debug keep working the same way.
function normalize(a: unknown, b?: string): [string, LogMeta] {
  if (typeof a === "string") return [a, {}];
  const err = a instanceof Error ? a : ((a as LogMeta)?.err as Error | undefined);
  const meta: LogMeta = a instanceof Error ? {} : { ...(a as LogMeta) };
  if (err instanceof Error) meta.err = { name: err.name, message: err.message, stack: err.stack };
  return [b ?? err?.message ?? String(a), meta];
}

function log(levelName: LogLevel, a: unknown, b?: string) {
  if (LEVELS.indexOf(levelName) > levelIndex) return;
  const [message, meta] = normalize(a, b);
  const write = levelName === "fatal" || levelName === "error" ? console.error : console.log;

  if (isProd) {
    write(JSON.stringify({ level: levelName, time: new Date().toISOString(), message, ...meta }));
  } else {
    const time = new Date().toISOString().slice(11, 19);
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    write(`[${time}] ${levelName}: ${message}${rest}`);
  }
}

export const logger = {
  fatal: (a: unknown, b?: string) => log("fatal", a, b),
  error: (a: unknown, b?: string) => log("error", a, b),
  warn: (a: unknown, b?: string) => log("warn", a, b),
  info: (a: unknown, b?: string) => log("info", a, b),
  debug: (a: unknown, b?: string) => log("debug", a, b),
};
