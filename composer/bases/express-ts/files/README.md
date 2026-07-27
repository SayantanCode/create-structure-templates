# {{projectName}}

Express API (TypeScript), composed from the pieces you chose when scaffolding.

## Project Structure

- `src/app.ts` — Express app: middleware, routes, error handling.
- `src/server.ts` — Bootstraps the server (and any modules that need startup work, e.g. a DB connection).
- `src/routes/` — Endpoint definitions.
- `src/middlewares/` — Error handling, plus whatever auth/RBAC/validation you selected.
- `src/utils/` — `ApiError`, the response envelope, `asyncHandler`.

## Response format

Every endpoint returns the same envelope:

```json
{ "success": true, "data": { } }
```

```json
{ "success": false, "error": { "message": "...", "code": "NOT_FOUND" } }
```

Throw an `ApiError` (e.g. `ApiError.notFound("User not found")`) from anywhere inside an `asyncHandler`-wrapped route and the centralized error handler in `middlewares/error.ts` turns it into the error envelope automatically.

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```
