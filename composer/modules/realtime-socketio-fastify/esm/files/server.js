import "dotenv/config";
import { createServer } from "./app.js";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/index.js";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  // __COMPOSER_STARTUP__
  const app = createServer();
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
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
