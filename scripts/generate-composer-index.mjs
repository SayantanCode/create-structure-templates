import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const COMPOSER_DIR = path.join(ROOT, "composer");

const basesDir = path.join(COMPOSER_DIR, "bases");
const bases = fs
  .readdirSync(basesDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const modulesDir = path.join(COMPOSER_DIR, "modules");
const moduleKeys = fs
  .readdirSync(modulesDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const modules = moduleKeys.map((key) => {
  const manifestPath = path.join(modulesDir, key, "module.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  if (manifest.key !== key) {
    throw new Error(`module.json "key" (${manifest.key}) doesn't match directory name (${key})`);
  }
  return manifest;
});

const index = { bases, modules };

fs.writeFileSync(
  path.join(COMPOSER_DIR, "composer-index.json"),
  JSON.stringify(index, null, 2) + "\n",
  "utf-8"
);
console.log(`Wrote composer-index.json with ${bases.length} base(s) and ${modules.length} module(s).`);
