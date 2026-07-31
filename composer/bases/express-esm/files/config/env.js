import { z } from "zod";

// Fails fast and loudly at boot if the environment is misconfigured,
// instead of surfacing as a confusing runtime error later (a bad PORT
// crashing app.listen, a malformed CORS_ORIGIN silently blocking every
// cross-origin request, ...). Vars owned by optional modules (a database,
// auth, ...) are validated here too, but only when actually set — an
// absent one just means that module wasn't picked.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  LOG_LEVEL: z.string().optional(),
  MONGO_URI: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(1).optional(),
  JWT_REFRESH_SECRET: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
