// Loaded before anything else — feature modules (e.g. auth) read secrets
// like JWT_ACCESS_SECRET at module-load time, and Node fully resolves the
// AppModule import chain below before ConfigModule.forRoot() ever gets a
// chance to run, so relying on that alone loads .env too late.
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { applyGlobalPrefix } from "./common/utils/configure-app";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalPrefix(app);
  // __COMPOSER_MIDDLEWARE__
  // __COMPOSER_STARTUP__
  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  console.log(`🚀 Server ready at http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
