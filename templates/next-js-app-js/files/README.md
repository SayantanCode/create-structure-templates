# {{projectName}}

Next.js app using the App Router.

## Structure

- `app/layout.js` — root layout, wraps every page
- `app/page.js` — the `/` route
- `app/globals.css` — global styles

## Adding a new route

Create `app/<route>/page.js` — the folder path IS the URL path (e.g. `app/about/page.js` → `/about`). Add `layout.js` in a subfolder to give that route (and its children) its own wrapping layout.

## Getting started

```bash
npm install
npm run dev
```
