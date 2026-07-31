require("dotenv/config");
const { createServer } = require("./app.js");
const { Server } = require("socket.io");
const { registerSocketHandlers } = require("./sockets/index.js");
const { logger } = require("./utils/logger.js");
const { env } = require("./config/env.js");
// __COMPOSER_IMPORTS__

async function bootstrap() {
  // __COMPOSER_STARTUP__
  const app = createServer();
  const port = env.PORT;
  const httpServer = app.listen(port, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}`);
  });

  const io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGIN, credentials: true },
  });
  registerSocketHandlers(io);

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down gracefully...`);
    io.close();
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
