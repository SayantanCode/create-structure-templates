import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// __COMPOSER_IMPORTS__

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1", { exclude: ["health"] });
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
