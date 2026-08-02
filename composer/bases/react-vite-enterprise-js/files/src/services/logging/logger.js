import { env } from "@/config/env";

// Thin wrapper around console so call sites read `logger.error(...)`
// instead of `console.error(...)` — swap the bodies for a real logging
// service (Sentry breadcrumbs, LogRocket, ...) in one place later.
export const logger = {
  debug(...args) {
    if (env.isDev) console.debug("[debug]", ...args);
  },
  info(...args) {
    console.info("[info]", ...args);
  },
  warn(...args) {
    console.warn("[warn]", ...args);
  },
  error(...args) {
    console.error("[error]", ...args);
  },
};
