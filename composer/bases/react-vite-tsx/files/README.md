# {{projectName}}

React + Vite frontend, composed from the pieces you chose when scaffolding.

## Project structure

```
src/
  main.tsx               — mounts <App/> inside an ErrorBoundary
  App.tsx                — root component; any selected providers (router, auth, ...) wrap the tree here
  index.css              — global styles / CSS reset
  components/
    Button.tsx           — reusable button (implementation depends on which styling library you picked)
    Input.tsx             — reusable text input
    Modal.tsx             — reusable dialog
    Spinner.tsx           — reusable loading indicator
    ErrorBoundary.tsx     — catches render errors, shows a fallback instead of a blank screen
```

## The `components/` contract

`Button` / `Input` / `Modal` / `Spinner` are the one place every other module (auth forms, router pages, the state demo, ...) depends on — and the *only* thing that changes based on which styling library you picked at scaffold time (Tailwind / MUI / Ant Design / plain CSS). Whichever one you chose owns these four files; everything else in the project imports them the same way regardless of which library is actually behind them:

```tsx
import { Button } from "./components/Button";
import { Input } from "./components/Input";

<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
<Button onClick={handleSubmit}>Submit</Button>
```

Want to switch styling libraries later? Re-run the composer, or hand-replace these four files with your own implementation — nothing else in the project needs to change.

## Error handling

`ErrorBoundary` (wrapping `<App/>` in `main.tsx`) catches any render-time error below it in the tree and shows a fallback instead of a blank white screen. Extend `componentDidCatch` in `src/components/ErrorBoundary.tsx` to report errors to a real service (Sentry, etc.) in production.

<!-- __COMPOSER_README__ -->

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```
