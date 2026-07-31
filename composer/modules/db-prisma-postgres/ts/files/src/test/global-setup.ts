// Runs once before any test file, in Jest's main process — unlike
// setupFilesAfterEnv, which loads inside each test file's own sandboxed
// module registry. testcontainers' Docker API calls (via dockerode/docker-modem)
// crash under that per-file sandbox on Node + ts-jest's ESM mode, so container
// startup lives here instead, and only the resulting DATABASE_URL crosses over
// via process.env (which Jest carries into every test file's environment).
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

const STATE_FILE = path.join(os.tmpdir(), "create-structure-prisma-postgres-test.json");

export default async function globalSetup() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();
  const databaseUrl = container.getConnectionUri();

  process.env.DATABASE_URL = databaseUrl;
  writeFileSync(STATE_FILE, JSON.stringify({ containerId: container.getId(), databaseUrl }));

  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
