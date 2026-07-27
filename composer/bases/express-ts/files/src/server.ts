import "dotenv/config";
import { createServer } from "./app.js";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  // __COMPOSER_STARTUP__
  const app = createServer();
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
