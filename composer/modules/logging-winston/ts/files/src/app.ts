import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { env } from "./config/env.js";
// __COMPOSER_IMPORTS__

/**
 * Creates and returns the Express application.
 * This function should only contain middleware and route mounting.
 * Server bootstrap logic is in server.ts.
 */
export function createServer() {
  const app = express();

  // Core middleware
  app.use(helmet());
  // credentials: true (+ a specific origin, never "*") is required for the
  // browser to accept the httpOnly refresh-token cookie on a cross-origin
  // request — the default cors() config allows any origin but not
  // credentials, which silently breaks a separate-origin frontend's fetch
  // calls that use `credentials: "include"`.
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  // Structured, leveled request logging — attaches a request-scoped
  // req.log (with a generated request id) that other middleware/handlers
  // can log through too, instead of morgan's plain unstructured line-per-request text.
  app.use(requestLogger);
  // __COMPOSER_MIDDLEWARE__

  // Liveness: the process is up and handling requests. Doesn't check
  // dependencies — that's what /healthz is for.
  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  // Readiness: is this instance actually able to serve real traffic right
  // now? Each database module contributes its own connectivity check —
  // an empty list here (no database module selected) is vacuously "ok".
  app.get("/healthz", async (_req, res) => {
    const checks: { name: string; check: () => boolean | Promise<boolean> }[] = [
      // __COMPOSER_READINESS__
    ];
    const results = await Promise.all(
      checks.map(async (c) => ({ name: c.name, ok: await c.check() }))
    );
    const allOk = results.every((r) => r.ok);
    res.status(allOk ? 200 : 503).json({
      status: allOk ? "ok" : "unavailable",
      checks: Object.fromEntries(results.map((r) => [r.name, r.ok])),
    });
  });

  // Routes
  app.use("/api/v1", routes);

  // Error handling middleware (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
