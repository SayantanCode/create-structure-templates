require("dotenv/config");
const { loadApp } = require("./loaders/index.js");
const { logger } = require("./utils/logger.js");
const { env } = require("./config/env.js");
// __COMPOSER_IMPORTS__

async function bootstrap() {
  const app = await loadApp();
  const port = env.PORT;
  const httpServer = app.listen(port, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}`);
  });

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down gracefully...`);
    httpServer.close(() => logger.info("HTTP server closed"));
    // __COMPOSER_SHUTDOWN__
    process.exit(0);
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  logger.fatal(err, "Fatal bootstrap error");
  process.exit(1);
});
