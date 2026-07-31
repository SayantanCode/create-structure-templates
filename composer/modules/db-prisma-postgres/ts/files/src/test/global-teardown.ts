// Counterpart to global-setup.ts. Stops the container via the plain `docker`
// CLI rather than re-importing testcontainers here — this file also runs
// outside the sandboxed per-test-file module registry, but there's no need
// to pull dockerode back in just to shut the container down.
import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const STATE_FILE = path.join(os.tmpdir(), "create-structure-prisma-postgres-test.json");

export default async function globalTeardown() {
  if (!existsSync(STATE_FILE)) return;
  const { containerId } = JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  try {
    execSync(`docker stop ${containerId}`, { stdio: "inherit" });
  } finally {
    rmSync(STATE_FILE, { force: true });
  }
}
