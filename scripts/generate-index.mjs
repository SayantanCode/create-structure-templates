import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const TEMPLATES_DIR = path.join(ROOT, "templates");

const keys = fs
  .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const index = keys.map((key) => {
  const manifestPath = path.join(TEMPLATES_DIR, key, "template.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  if (manifest.key !== key) {
    throw new Error(`template.json "key" (${manifest.key}) doesn't match directory name (${key})`);
  }
  return manifest;
});

fs.writeFileSync(path.join(ROOT, "index.json"), JSON.stringify(index, null, 2) + "\n", "utf-8");
console.log(`Wrote index.json with ${index.length} templates.`);
