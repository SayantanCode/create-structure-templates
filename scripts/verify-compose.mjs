// Composes one base+modules combo against THIS checkout (not whatever's
// live on GitHub) and runs npm install + build, so CI can actually catch a
// broken template before it merges instead of only ever validating what
// was already on main.
//
// Usage: node scripts/verify-compose.mjs <base> <comma,separated,modules> <outDir>
// Env:
//   COMPOSER_LOCAL_DIR — path to this repo's composer/ directory
//   CLI_REPO_PATH      — path to a checked-out cli-project-structure-builder (default: ../cli)

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const [, , baseKey, modulesArg, outDir] = process.argv;
if (!baseKey || !outDir) {
  console.error("Usage: node scripts/verify-compose.mjs <base> <comma,separated,modules> <outDir>");
  process.exit(1);
}
const moduleKeys = modulesArg ? modulesArg.split(",").filter(Boolean) : [];

const localDir = process.env.COMPOSER_LOCAL_DIR;
if (!localDir) {
  console.error("COMPOSER_LOCAL_DIR must be set (path to this repo's composer/ directory).");
  process.exit(1);
}

const cliRepoPath = process.env.CLI_REPO_PATH || "../cli";
const composerModulePath = path.resolve(cliRepoPath, "lib/composer.js");
const { composeBackend } = await import(pathToFileURL(composerModulePath).href);

const index = JSON.parse(fs.readFileSync(path.join(localDir, "composer-index.json"), "utf-8"));
const base = index.bases.find((b) => b.key === baseKey);
if (!base) {
  console.error(`Unknown base "${baseKey}". Available: ${index.bases.map((b) => b.key).join(", ")}`);
  process.exit(1);
}

console.log(`Composing ${baseKey} + [${moduleKeys.join(", ") || "(no modules)"}] -> ${outDir}`);
await composeBackend({
  baseKey,
  moduleKeys,
  language: base.language,
  outDir,
  vars: { projectName: "verify-app" },
});

console.log("Installing dependencies...");
execSync("npm install --no-audit --no-fund", { cwd: outDir, stdio: "inherit" });

const pkg = JSON.parse(fs.readFileSync(path.join(outDir, "package.json"), "utf-8"));
if (pkg.scripts?.build) {
  console.log("Building...");
  execSync("npm run build", { cwd: outDir, stdio: "inherit" });
} else {
  console.log("No build script on this base — skipping build step.");
}

console.log(`OK: ${baseKey} + [${moduleKeys.join(", ") || "(no modules)"}]`);
