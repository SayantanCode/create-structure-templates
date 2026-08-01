const LEVELS = ["fatal", "error", "warn", "info", "debug"];
const configuredLevel = (process.env.LOG_LEVEL || "info").toLowerCase();
const levelIndex = LEVELS.includes(configuredLevel) ? LEVELS.indexOf(configuredLevel) : LEVELS.indexOf("info");
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
function normalize(a, b) {
  if (typeof a === "string") return [a, {}];
  const err = a instanceof Error ? a : a?.err;
  const meta = a instanceof Error ? {} : { ...a };
  if (err instanceof Error) meta.err = { name: err.name, message: err.message, stack: err.stack };
  return [b ?? err?.message ?? String(a), meta];
}

function log(levelName, a, b) {
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
  fatal: (a, b) => log("fatal", a, b),
  error: (a, b) => log("error", a, b),
  warn: (a, b) => log("warn", a, b),
  info: (a, b) => log("info", a, b),
  debug: (a, b) => log("debug", a, b),
};
