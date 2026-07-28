# {{projectName}}

NestJS API, composed from the pieces you chose when scaffolding.

## Project Structure

- `src/main.ts` — Bootstraps the Nest application (`api/v1` global prefix, `/health` excluded from it).
- `src/app.module.ts` — Root module; every feature module you selected is registered here.
- `src/app.controller.ts` — Health check endpoint.
- `src/common/` — `ApiError`, the global exception filter + response interceptor (response envelope), the Zod validation pipe.

## Response format

Every endpoint returns the same envelope, applied automatically by a global interceptor/filter — just `return` your data or `throw` an `ApiError` from a controller or provider:

```json
{ "success": true, "data": { } }
```

```json
{ "success": false, "error": { "message": "...", "code": "NOT_FOUND" } }
```

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```
