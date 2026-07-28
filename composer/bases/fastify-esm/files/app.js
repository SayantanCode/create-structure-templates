import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";
// __COMPOSER_IMPORTS__

/**
 * Creates and returns the Fastify instance.
 * This function should only contain plugin registration and route mounting.
 * Server bootstrap logic is in server.js.
 */
export function createServer() {
  const fastify = Fastify({ logger: true });

  // credentials: true (+ a specific origin, never "*") is required for the
  // browser to accept the httpOnly refresh-token cookie on a cross-origin
  // request — the default cors registration allows any origin but not
  // credentials, which silently breaks a separate-origin frontend's fetch
  // calls that use `credentials: "include"`.
  fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  });
  // __COMPOSER_MIDDLEWARE__

  // Health check endpoint
  fastify.get("/health", async () => ({ status: "ok" }));

  // Routes
  fastify.register(routes, { prefix: "/api/v1" });

  fastify.setNotFoundHandler(notFound);
  fastify.setErrorHandler(errorHandler);

  return fastify;
}
