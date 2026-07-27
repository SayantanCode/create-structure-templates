const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const routes = require("./routes/index.js");
const { notFound, errorHandler } = require("./middlewares/error.js");
// __COMPOSER_IMPORTS__

/**
 * Creates and returns the Express application.
 * This function should only contain middleware and route mounting.
 * Server bootstrap logic is in server.js.
 */
function createServer() {
  const app = express();

  // Core middleware
  app.use(helmet());
  app.use(cors());
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

module.exports = { createServer };
