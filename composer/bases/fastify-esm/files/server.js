import "dotenv/config";
import { createServer } from "./app.js";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  // __COMPOSER_STARTUP__
  const app = createServer();
  const port = Number(process.env.PORT || 4000);
  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    app.log.info(`${signal} received, shutting down gracefully...`);
    // fastify.close() also closes the underlying http.Server and runs any
    // registered onClose hooks (plugins clean up after themselves).
    await app.close();
    // __COMPOSER_SHUTDOWN__
    process.exit(0);
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
