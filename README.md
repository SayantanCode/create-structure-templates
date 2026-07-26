# create-structure-templates

Template registry for [create-structure-cli](https://github.com/SayantanCode/cli-project-structure-builder). Fetched at scaffold time — not bundled into the CLI's npm package.

## Layout

```
templates/
  <template-key>/
    template.json   # metadata: name, description, category, framework, language, devCommand, ...
    files/           # the actual files copied into the user's project ({{projectName}} is substituted)
index.json           # generated: aggregates every template.json, used by the CLI to build its menu
```

## Adding a template

1. Create `templates/<key>/template.json` and `templates/<key>/files/`.
2. `template.json` must include: `key` (matches the directory name), `name`, `description`, `category`, `framework`, `language`, `devCommand`. Add `variant` and/or `router` if the framework needs another menu dimension.
3. Use `{{projectName}}` anywhere in a text file that should be substituted with the user's chosen project name.
4. Regenerate the index: `node scripts/generate-index.mjs`.
5. Commit and push — the CLI always fetches from `main`, so this takes effect immediately for all users.

## Why a separate repo

Templates used to be bundled inside the CLI's npm package. That meant every template update required a full CLI release, and every added template grew the package size for everyone whether they used it or not. This repo is fetched on demand instead.
