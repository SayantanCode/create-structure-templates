# {{projectName}}

An opinionated **enterprise** React + Vite foundation — feature-based
architecture, a platform layer (permissions, feature flags, realtime,
telemetry, cache, offline sync, plugins), multiple layouts, and a 19-component
React Hook Form library on top of MUI. Built for a long-lived app maintained
by multiple teams, not a small starter — if you want something minimal and
swappable, use the plain `react-vite-jsx`/`react-vite-tsx` bases instead.

This base is **self-contained and JavaScript-only** — it doesn't compose with
the other modules (styling/router/state/auth/realtime) the lighter bases do,
since it already ships its own opinionated version of all of them.

## Stack

React 19 · Vite · React Router · Redux Toolkit + React Redux · React Hook
Form · MUI (+ dayjs) · Axios · Socket.IO client · Vitest + React Testing
Library · ESLint + Prettier.

## Project structure

```
src/
  app/            — composition root: App.jsx, AppProviders.jsx (every
                    provider nests here, in one place), AppErrorBoundary.jsx,
                    store/ (Redux store + rootReducer)
  config/         — runtime configuration: env.js (the only place
                    import.meta.env is read), theme.config.js (MUI tokens)
  constants/      — routes, roles, permissions, regex, storage keys, socket
                    events, feature-flag keys, date formats, colors — small,
                    single-purpose files, one concept each
  layouts/        — MainLayout (Header/Footer), DashboardLayout (composes
                    MainLayout + Sidebar), AuthLayout, BlankLayout
  routes/         — AppRoutes.jsx, routeRegistry.js (aggregates each
                    feature's own routes), ProtectedRoute/PublicRoute/
                    PermissionRoute guards, breadcrumbs.js
  platform/       — app-wide infrastructure, no UI business logic:
                    permissions, featureFlags, events, realtime, telemetry,
                    cache, sync, plugins — see "Platform layer" below
  services/       — GLOBAL services only (api client, token storage,
                    logging, notifications, downloads) — feature-specific
                    services live inside their own feature instead
  shared/         — the internal UI framework: ui/ (PageHeader,
                    SectionCard, StatCard, EmptyState, ...), components/
                    forms/ (the RHF* library) and components/table/ (the
                    generic DataTable shell), hooks/, lib/, providers/,
                    icons/, utils/, validators/
  features/       — business features, each owning its own pages/,
                    components/, store/ (Redux slice), api/, services/,
                    selectors/, validations/, routes.jsx:
                      auth/       — login/register/forgot-password
                      dashboard/  — the "/" landing page
                      contacts/   — full reference feature: modular table
                                    (columns/toolbar/filters/row actions),
                                    a create/edit dialog, an RTK slice with
                                    async thunks, memoized selectors — read
                                    this before building your first real one
  styles/         — global.css (the handful of things outside MUI's own theme)
tests/
  setupTests.js   — jest-dom matchers
  unit/           — example tests (platform/permissions' can(), RHFInput)
```

## Path aliases

`@/` maps to `src/` (configured in `vite.config.js`'s `resolve.alias`, mirrored
in `jsconfig.json` for editor IntelliSense) — `@/shared/components/forms`,
`@/features/contacts/store/contactsSlice`, and so on. `@/../tests/...` isn't
needed — `jsconfig.json`'s `include` covers `tests/` too, so editors resolve
imports from test files the same way.

## Layouts

Four layouts, none duplicating another's chrome:

- **MainLayout** owns the Header (brand + theme toggle) and Footer.
- **DashboardLayout** composes MainLayout internally and adds a Sidebar —
  it doesn't re-declare its own header/footer.
- **AuthLayout** is a centered card, used by login/register/forgot-password.
- **BlankLayout** has no chrome at all — used for the 404 page.

## Routing

`routes/routeRegistry.js` aggregates each feature's own `routes.jsx` (one
array per feature — `dashboardRoutes`, `contactsRoutes`, `authRoutes`) plus
anything `platform/plugins` has registered. `routes/AppRoutes.jsx` groups
that flat list by `layout` and applies the right guard:

- Dashboard routes are wrapped in `ProtectedRoute` (redirects to `/login` if
  not authenticated) and, if the route declares a `permission`, also
  `PermissionRoute` (redirects home if the user lacks it).
- Auth routes are wrapped in `PublicRoute` (redirects home if you're
  already logged in — no reason to see `/login` again).
- `features/contacts/routes.jsx` uses `React.lazy` — a heavier,
  not-always-needed page benefits from code-splitting; `features/auth/routes.jsx`
  deliberately doesn't, since those pages are on the critical path for a
  signed-out visitor.

Add a new feature's pages by writing its own `routes.jsx` (see
`features/contacts/routes.jsx`) and adding one line to
`routes/routeRegistry.js`.

## Platform layer

App-wide infrastructure, kept out of `shared/` (which is UI) and out of any
one feature (since every feature needs it):

- **permissions** — `can(user, permission)` (pure, unit-tested), the
  `usePermission()`/`<Can>` hooks/component for gating UI, and
  `routes/PermissionRoute` for gating whole pages.
- **featureFlags** — reads `VITE_FLAG_<KEY>` env vars by default; swap the
  provider's body for a real flag service later, `useFeatureFlag()` call
  sites don't change.
- **events** — a tiny pub/sub (`eventBus`) for cross-cutting signals that
  don't belong in a Redux slice (e.g. "the socket reconnected").
- **realtime** — a `socket.io-client` wrapper (connection/auth/reconnect —
  reconnect and heartbeat are already built into socket.io-client itself),
  `RealtimeProvider`, and `useChannel`/`usePresence` subscription hooks.
- **telemetry** — `track()`/`identify()`, console provider by default;
  swap in a real analytics vendor in one file.
- **cache** — a small in-memory TTL cache, not a data-fetching library.
- **sync** — a real, working pending-action queue that persists to
  `localStorage` and flushes on the browser's `online` event. It does
  **not** do conflict resolution — that needs your specific backend's
  semantics, which a template can't invent. Bring your own `handler`.
- **plugins** — `registerPlugin({ key, routes?, menuItems? })` — a plugin's
  routes/menu items merge into `routeRegistry`/the Sidebar automatically.

## The RHF form library (`shared/components/forms/`)

19 components, each a `Controller`-wrapped MUI field: `RHFInput`,
`RHFPassword`, `RHFTextarea`, `RHFSelect`, `RHFAutocomplete`,
`RHFAsyncAutocomplete`, `RHFCheckbox`, `RHFRadio`, `RHFSwitch`, `RHFPhone`,
`RHFCurrency`, `RHFNumber`, `RHFDatePicker`, `RHFTimePicker`,
`RHFDateTimePicker`, `RHFImageUpload`, `RHFFileUpload`, `RHFColorPicker`,
`RHFTagInput`.

```jsx
import { useForm } from "react-hook-form";
import { RHFInput, RHFSelect } from "@/shared/components/forms";

const { control, handleSubmit } = useForm({ defaultValues: { name: "", role: "" } });

<RHFInput name="name" control={control} label="Name" rules={{ required: "Required." }} />
<RHFSelect name="role" control={control} label="Role" options={[{ value: "admin", label: "Admin" }]} />
```

**No schema-validation library (yup/zod).** Validation is real either way —
just field-level `rules` objects (see `features/contacts/validations/contactRules.js`)
instead of a schema, passed straight to RHF's own `rules` API. Adding a
schema library later is a contained change (one `resolver:` line in
`useForm()`), not a refactor — and picking yup vs. zod for you would be an
unrequested, debatable choice baked into every project generated from this
base.

## The table shell (`shared/components/table/`)

`DataTable` + `TablePaginationBar` + `useTableState()` are generic — sorting/
pagination/selection state and rendering chrome. A feature owns its own
column definitions, toolbar, filters, and row actions built on top (see
`features/contacts/components/table/`), per the "modular tables" pattern —
not one 1000-line table component.

## Redux

One store (`app/store/store.js`), statically combined
(`app/store/rootReducer.js`) — one import + one key per feature slice. This
is the standard RTK pattern and stays O(1) friction per feature added even
at "100+ features"; dynamic reducer injection would add real store-enhancer
complexity for no benefit at this scale. Each feature owns its slice,
selectors, and async thunks (see `features/contacts/store/contactsSlice.js`
+ `selectors/contactsSelectors.js`).

## Demo API

The default `.env`'s `VITE_API_URL` points at
[JSONPlaceholder](https://jsonplaceholder.typicode.com), a stable public demo
API — real GET requests work out of the box (the Contacts page fetches real
data from `/users`), but writes (POST/PUT/DELETE) return a successful-looking
response without actually persisting anything, and there's no real `/auth/*`
route at all. That's why login/register will show a real (expected) error
toast until you repoint `VITE_API_URL` at your actual backend — the code
itself is correct and complete, it's just pointed at a demo API without auth.
To explore the protected dashboard/RBAC UI without a backend, use **"Continue
as demo user"** on the login page — a local-only shortcut, clearly separate
from the real login flow, that's the first thing to delete once you have a
real backend to log in against.

## Linting, formatting, testing

```bash
npm run lint          # eslint .
npm run format         # prettier --write .
npm run format:check   # prettier --check . (CI-friendly, no writes)
npm run test           # vitest run
npm run test:watch     # vitest, watch mode
```

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run format
npm run dev
```
