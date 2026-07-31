import "dotenv/config";
import { createServer } from "./app.js";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/index.js";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  // __COMPOSER_STARTUP__
  const app = createServer();
  const port = Number(process.env.PORT || 4000);
  const httpServer = app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });

  const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true },
  });
  registerSocketHandlers(io);
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
