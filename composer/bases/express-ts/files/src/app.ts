import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";
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
  app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  // __COMPOSER_MIDDLEWARE__

  // Health check endpoint
  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  // Routes
  app.use("/api/v1", routes);

  // Error handling middleware (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
