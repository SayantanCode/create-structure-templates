# {{projectName}}

React + Vite frontend, composed from the pieces you chose when scaffolding.

## Project structure

```
src/
  main.tsx               — mounts <App/> inside an ErrorBoundary
  App.tsx                — root component: ThemeProvider + Navbar + Home (or, with
                           router-react, BrowserRouter + Routes for Home/404). Any
                           selected providers (auth, ...) wrap the tree here
  pages/
    Home.tsx              — hero + component showcase (a grid of demo cards); any
                           selected module's demo (auth, state, realtime, ...) renders
                           here as its own card
  index.css              — global styles, CSS reset, theme custom properties
  theme/
    ThemeContext.tsx     — useTheme()/ThemeProvider — light/dark/system
  components/
    Navbar.tsx            — floating top nav (brand + Home link + ThemeToggle)
    Button.tsx           — reusable button (implementation depends on which styling library you picked)
    Input.tsx             — reusable text input
    Modal.tsx             — reusable dialog
    Spinner.tsx           — reusable loading indicator
    ThemeToggle.tsx        — the light/dark/system switcher, lives in Navbar
    ErrorBoundary.tsx     — catches render errors, shows a fallback instead of a blank screen
```

## Theming: light / dark / system

`ThemeProvider` (in `src/theme/ThemeContext.tsx`) wraps the whole app — always on, not a scaffold-time choice — with three built-in modes, persisted to `localStorage`. `ThemeToggle` (fixed top-right) switches between them; picking "System" live-tracks the OS `prefers-color-scheme` setting.

```tsx
import { useTheme } from "./theme/ThemeContext";

const { mode, setMode } = useTheme(); // mode: "light" | "dark" | "system"
```

Colors are plain CSS custom properties in `index.css` (`--bg`, `--fg`, `--card-bg`, `--border`, `--accent`, `--accent-2`), switched via a `data-theme="light"|"dark"` attribute on `<html>`. **Adding a 4th theme**: copy the `[data-theme="dark"]` block in `index.css`, give it a new `data-theme` value and your own colors, then add a matching option to `src/components/ThemeToggle.tsx` — `ThemeContext` itself doesn't need to change.

If you picked MUI or Ant Design, their own theming API (`ThemeProvider`/`createTheme` or `ConfigProvider`) is wired up in their own `ThemeContext.tsx` instead, driven by the exact same `mode` — see that module's README section.

## The `components/` contract

`Button` / `Input` / `Modal` / `Spinner` / `ThemeToggle` are the one place every other module (auth forms, router pages, the state demo, ...) depends on — and the _only_ thing that changes based on which styling library you picked at scaffold time (Tailwind / MUI / Ant Design / plain CSS). Whichever one you chose owns these files; everything else in the project imports them the same way regardless of which library is actually behind them:

```tsx
import { Button } from "./components/Button";
import { Input } from "./components/Input";

<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
<Button onClick={handleSubmit}>Submit</Button>
```

Want to switch styling libraries later? Re-run the composer, or hand-replace these files with your own implementation — nothing else in the project needs to change. The component showcase on the home page (`src/pages/Home.tsx`) exercises all four — a real, working example of each, not just an import you have to trust. If you picked MUI or Ant Design, their own `createTheme`/`ConfigProvider` primary color is pinned to the same indigo/purple accent the hero and Tailwind's own `Button` use, so the brand stays consistent regardless of which styling library is behind the widgets.

## Linting & formatting

ESLint (flat config, `eslint.config.js`) and Prettier are set up out of the box, matching what `npm create vite` ships:

```bash
npm run lint          # eslint .
npm run format        # prettier --write .
npm run format:check  # prettier --check . (CI-friendly, no writes)
```

Content merged in at scaffold time (this README, `App.tsx`/`Home.tsx`'s wired-up sections, test setup files) isn't guaranteed to match Prettier's exact formatting the moment it's composed — run `npm run format` once right after `npm install` and `format:check` stays clean for anything you edit yourself from then on.

## Error handling

`ErrorBoundary` (wrapping `<App/>` in `main.tsx`) catches any render-time error below it in the tree and shows a fallback instead of a blank white screen. Extend `componentDidCatch` in `src/components/ErrorBoundary.tsx` to report errors to a real service (Sentry, etc.) in production.

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run format
npm run dev
```
