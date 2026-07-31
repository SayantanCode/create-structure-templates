import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 moved CLI-level config (schema location, migrations path, and
// the connection string the CLI itself uses for `prisma db push`/`migrate`)
// out of schema.prisma and into this file — separate from the driver
// adapter the *runtime* client uses, set up in src/config/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
