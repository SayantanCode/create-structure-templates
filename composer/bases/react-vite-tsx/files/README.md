# {{projectName}}

React + Vite frontend, composed from the pieces you chose when scaffolding.

## Project structure

```
src/
  main.tsx               — mounts <App/> inside an ErrorBoundary
  App.tsx                — hero + component showcase + root component; any selected
                           providers (router, auth, ...) wrap the tree here
  index.css              — global styles, CSS reset, theme custom properties
  theme/
    ThemeContext.tsx     — useTheme()/ThemeProvider — light/dark/system
  components/
    Button.tsx           — reusable button (implementation depends on which styling library you picked)
    Input.tsx             — reusable text input
    Modal.tsx             — reusable dialog
    Spinner.tsx           — reusable loading indicator
    ThemeToggle.tsx        — the light/dark/system switcher, fixed top-right
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

`Button` / `Input` / `Modal` / `Spinner` / `ThemeToggle` are the one place every other module (auth forms, router pages, the state demo, ...) depends on — and the *only* thing that changes based on which styling library you picked at scaffold time (Tailwind / MUI / Ant Design / plain CSS). Whichever one you chose owns these files; everything else in the project imports them the same way regardless of which library is actually behind them:

```tsx
import { Button } from "./components/Button";
import { Input } from "./components/Input";

<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
<Button onClick={handleSubmit}>Submit</Button>
```

Want to switch styling libraries later? Re-run the composer, or hand-replace these files with your own implementation — nothing else in the project needs to change. The component showcase on the home page (`src/App.tsx`) exercises all four — a real, working example of each, not just an import you have to trust.

## Error handling

`ErrorBoundary` (wrapping `<App/>` in `main.tsx`) catches any render-time error below it in the tree and shows a fallback instead of a blank white screen. Extend `componentDidCatch` in `src/components/ErrorBoundary.tsx` to report errors to a real service (Sentry, etc.) in production.

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```
