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

  fastify.register(cors);
  // __COMPOSER_MIDDLEWARE__

  // Health check endpoint
  fastify.get("/health", async () => ({ status: "ok" }));

  // Routes
  fastify.register(routes, { prefix: "/api/v1" });

  fastify.setNotFoundHandler(notFound);
  fastify.setErrorHandler(errorHandler);

  return fastify;
}
