import { env } from "@/config/env";

// Console provider by default — every track()/identify() call is real and
// wired up end-to-end, it just logs instead of shipping to a vendor. Swap
// the two function bodies below for a real analytics SDK (Segment,
// Amplitude, PostHog, ...) when you have one; nothing that calls
// telemetry.track()/identify() needs to change.
export const telemetry = {
  track(event, payload = {}) {
    if (env.isDev) {
      console.info(`[telemetry] ${event}`, payload);
    }
  },
  identify(user) {
    if (env.isDev) {
      console.info("[telemetry] identify", user);
    }
  },
};
