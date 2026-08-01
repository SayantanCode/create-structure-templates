import "dotenv/config";
import { loadApp } from "./loaders/index.js";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/index.js";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  const app = await loadApp();
  const port = Number(process.env.PORT || 4000);

  // Socket.IO needs the raw http.Server to intercept the WebSocket upgrade —
  // Fastify creates one internally and exposes it as `app.server` before
  // `.listen()` is ever called.
  const io = new Server(app.server, {
    cors: { origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true },
  });
  registerSocketHandlers(io);

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
    // fastify.close() also closes the underlying http.Server (which io is
    // attached to) and runs any registered onClose hooks.
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
