# {{projectName}}

A minimal Express + Mongoose starter: one model, one route, no extras.

## Structure

- `src/server.ts` — app entrypoint; connects to MongoDB and starts the server
- `src/models/` — Mongoose schemas
- `src/routes/` — Express routers

## Response format

Every endpoint returns `{ success: true, data }` or `{ success: false, error: { message } }`.

## Adding a new resource

1. Add a schema in `src/models/<name>.model.ts`
2. Add a router in `src/routes/<name>.routes.ts` (copy `item.routes.ts` as a starting point)
3. Mount it in `src/server.ts`: `app.use("/api/<name>", <name>Routes)`

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Looking for more structure (validation, layered services, Docker, background jobs)? Use the "Mongoose (Advanced/Pro Devs)" variant instead.
