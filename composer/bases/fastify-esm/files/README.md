# {{projectName}}

Fastify API, composed from the pieces you chose when scaffolding.

## Project Structure

- `app.js` — Fastify instance: plugins, routes, error handling.
- `server.js` — Bootstraps the server (and any modules that need startup work, e.g. a DB connection).
- `routes/` — Route plugins.
- `middlewares/` — Error handling, plus whatever auth/RBAC/validation you selected (Fastify calls these "hooks"/"preHandlers", not middleware, but the files live in the same place for consistency with the rest of this CLI's templates).
- `utils/` — `ApiError`, the response envelope.

Note: Fastify automatically routes a rejected promise from any async route handler or `preHandler` hook to the error handler below — there's no need for an `asyncHandler` wrapper like Express-based templates use.

## Response format

Every endpoint returns the same envelope:

```json
{ "success": true, "data": { } }
```

```json
{ "success": false, "error": { "message": "...", "code": "NOT_FOUND" } }
```

Throw an `ApiError` (e.g. `ApiError.notFound("User not found")`) from anywhere inside a route handler or `preHandler` and the centralized error handler in `middlewares/error.js` turns it into the error envelope automatically.

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```
