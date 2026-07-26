# {{projectName}}

A minimal Express + Mongoose starter: one model, one route, no extras.

## Structure

- `server.js` — app entrypoint; connects to MongoDB and starts the server
- `models/` — Mongoose schemas
- `routes/` — Express routers

## Response format

Every endpoint returns `{ success: true, data }` or `{ success: false, error: { message } }`.

## Adding a new resource

1. Add a schema in `models/<name>.model.js`
2. Add a router in `routes/<name>.routes.js` (copy `item.routes.js` as a starting point)
3. Mount it in `server.js`: `app.use("/api/<name>", <name>Routes)`

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Looking for more structure (validation, layered services, Docker, background jobs)? Use the "Mongoose (Advanced/Pro Devs)" variant instead.
