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
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
