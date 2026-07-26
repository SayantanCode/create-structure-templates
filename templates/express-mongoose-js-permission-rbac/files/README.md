# {{projectName}}

Express + Mongoose API with a layered architecture, JWT auth, and permission-based access control.

## Project Structure

- `app.js` — Express app: middleware, routes, error handling.
- `server.js` — Bootstraps the DB connection and starts listening.
- `config/` — Environment validation and the MongoDB connection.
- `loaders/` — Wires routes into the app.
- `routes/` — Endpoint definitions, grouped by resource.
- `controllers/` — Request/response handling; delegates to services.
- `services/` — Business logic.
- `repositories/` — Thin Mongoose query layer.
- `models/` — Mongoose schemas.
- `validators/` — Zod request-body schemas.
- `middlewares/` — Auth, RBAC, validation, error handling.
- `utils/` — `ApiError`, the response envelope, JWT helpers, `asyncHandler`.

## Response format

Every endpoint returns the same envelope:

```json
{ "success": true, "data": { } }
```

```json
{ "success": false, "error": { "message": "...", "code": "NOT_FOUND" } }
```

Throw an `ApiError` (e.g. `ApiError.notFound("User not found")`) from anywhere inside an `asyncHandler`-wrapped route and the centralized error handler in `middlewares/error.js` turns it into the error envelope automatically — no try/catch needed in controllers/services.

## Auth

JWT access token (short-lived, returned in the response body) + refresh token (long-lived, httpOnly cookie).

- `POST /api/v1/auth/register` — create an account
- `POST /api/v1/auth/login` — get a new access token + refresh cookie
- `POST /api/v1/auth/refresh` — exchange the refresh cookie for a new access token
- `POST /api/v1/auth/logout` — clears the refresh cookie
- `GET /api/v1/auth/me` — current user (requires `Authorization: Bearer <accessToken>`)

## RBAC (Permission-based)

A role maps to a list of permissions in `config/permissions.js`, and routes declare which permission they need rather than which role:

```js
router.delete("/:id", requireAuth, requirePermission("users:delete"), controller.deleteUser);
```

Add a new role, or change what an existing role can do, by editing `config/permissions.js` only — no route changes needed. There's no self-service way to become an admin (by design). Promote a user after they've registered:

```bash
node scripts/create-admin.js someone@example.com
```

## Getting started

```bash
cp .env.example .env   # then fill in real JWT secrets
npm install
npm run dev
```

## Testing

```bash
npm test
```

Runs against an in-memory MongoDB instance (`mongodb-memory-server`) — no real database needed.

## Docker

```bash
docker-compose up --build
```
