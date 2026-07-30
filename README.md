# create-structure-templates

Template registry for [create-structure-cli](https://github.com/SayantanCode/cli-project-structure-builder). Fetched at scaffold time — not bundled into the CLI's npm package.

## Layout

```
templates/
  <template-key>/
    template.json   # metadata: name, description, category, framework, language, devCommand, ...
    files/           # the actual files copied into the user's project ({{projectName}} is substituted)
index.json           # generated: aggregates every template.json, used by the CLI's Built-in Boilerplate menu

composer/
  bases/<base-key>/files/, base.json         # a full starting project (Express, Fastify, NestJS, React+Vite, ...)
  modules/<module-key>/<language>/files/, module.json  # an independent, pickable piece (auth, database, styling, ...)
  composer-index.json  # generated: aggregates every base.json + module.json, used by the CLI's Compose a Project menu
```

The composer is the CLI's bigger, mix-and-match generator ("Compose a Project" / "Compose a Full-Stack App" in the menu) — pick a base, then independently pick a module per dimension (auth, database, styling, ...). See `cli-project-structure-builder`'s README for how that's used from the CLI side; this repo only owns the actual base/module files.

## Adding a built-in template

1. Create `templates/<key>/template.json` and `templates/<key>/files/`.
2. `template.json` must include: `key` (matches the directory name), `name`, `description`, `category`, `framework`, `language`, `devCommand`. Add `variant` and/or `router` if the framework needs another menu dimension.
3. Use `{{projectName}}` anywhere in a text file that should be substituted with the user's chosen project name.
4. Regenerate the index: `node scripts/generate-index.mjs`.
5. Commit and push — the CLI always fetches from `main`, so this takes effect immediately for all users.

## Adding a composer base or module

1. Base: `composer/bases/<key>/files/` + `composer/bases/<key>/base.json` (`key`, `name`, `framework`, `language`). Module: `composer/modules/<key>/<language>/files/` + `composer/modules/<key>/module.json` (`key`, `name`, `dimension`, `framework`, `languages`, `dependsOn`, plus per-language `dependencies`/`devDependencies`/`wiring`/`readme`/`envExample`).
2. Regenerate the index: `node scripts/generate-composer-index.mjs`.
3. **Verify before pushing** — see below. There's no automated safety net beyond what CI catches on your PR; a broken commit here goes live to every user immediately once merged.

## Verifying a change

CI (`.github/workflows/verify.yml`) checks two things on every push/PR:

- **`composer-index.json`/`index.json` are actually regenerated**, not hand-edited or forgotten (fails the build if `node scripts/generate-*.mjs` produces a diff from what's committed).
- **A representative matrix of base+module combos actually composes, installs, and builds** — using `scripts/verify-compose.mjs` against *this* checkout (not whatever's already live on `main`), by checking out `cli-project-structure-builder` alongside it and pointing `lib/composer.js` at a local directory via `COMPOSER_LOCAL_DIR` instead of fetching from GitHub.

To run the same check locally before pushing (with `cli-project-structure-builder` checked out as a sibling directory, or point `CLI_REPO_PATH` elsewhere):

```bash
COMPOSER_LOCAL_DIR="$(pwd)/composer" CLI_REPO_PATH="../cli-project-structure-builder" \
  node scripts/verify-compose.mjs express-ts "db-mongoose,auth-jwt,validation-zod" /tmp/verify-out
```

The CI matrix only covers a representative slice (every base at least once, every styling module at least once), not every possible combination — if you add a module, add it to at least one matrix entry in `verify.yml` too.

## Why a separate repo

Templates used to be bundled inside the CLI's npm package. That meant every template update required a full CLI release, and every added template grew the package size for everyone whether they used it or not. This repo is fetched on demand instead.
