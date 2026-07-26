# {{projectName}}

Next.js app using the Pages Router.

## Structure

- `pages/_app.js` — wraps every page (global layout/providers go here)
- `pages/index.js` — the `/` route
- `pages/api/` — API routes (each file is an endpoint, e.g. `pages/api/hello.js` → `/api/hello`)
- `styles/` — global and module CSS

## Adding a new route

Create `pages/<route>.js` — the file path IS the URL path (e.g. `pages/about.js` → `/about`).

## Getting started

```bash
npm install
npm run dev
```
