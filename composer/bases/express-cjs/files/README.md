# {{projectName}}

Express API (CommonJS), composed from the pieces you chose when scaffolding.

## Project Structure

- `app.js` — Express app: middleware, routes, error handling.
- `loaders/index.js` — Connects external resources (database, cache, queue, ...) before the app is created. See "Loaders" below.
- `server.js` — Bootstraps the server: calls the loaders, then starts listening and wires up graceful shutdown.
- `routes/` — Endpoint definitions.
- `middlewares/` — Error handling, plus whatever auth/RBAC/validation you selected.
- `utils/` — `ApiError`, the response envelope, `asyncHandler`.

## Loaders

`loaders/index.js` is where every external dependency (database, cache, message queue, ...) gets connected, in order, before the app starts accepting requests — so a request can never arrive before something it needs is ready. If you picked a database module, its connection call already lives here; `server.js` itself no longer knows or cares how many things had to be set up first, it just calls `loadApp()`.

If you didn't pick anything that needs this — no database, no cache — this file is a harmless pass-through straight to `createServer()`. You can safely ignore it and never open it. If you add your own dependency later (e.g. Redis), follow the shape the database module already uses: a `require` at the top, one `await` line inside `loadApp()`.

## Response format

Every endpoint returns the same envelope:

```json
{ "success": true, "data": { } }
```

```json
{ "success": false, "error": { "message": "...", "code": "NOT_FOUND" } }
```

Throw an `ApiError` (e.g. `ApiError.notFound("User not found")`) from anywhere inside an `asyncHandler`-wrapped route and the centralized error handler in `middlewares/error.js` turns it into the error envelope automatically.

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```
