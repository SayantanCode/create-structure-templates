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
  // credentials: true (+ a specific origin, never "*") is required for the
  // browser to accept the httpOnly refresh-token cookie on a cross-origin
  // request. Nest has no CORS enabled at all by default, which would
  // otherwise silently block every cross-origin request outright.
  app.enableCors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true });
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
