import { ThemeToggle } from "@/components/ThemeToggle";

// Always present, regardless of whether router-react is picked — a stable
// brand/navigation anchor so Home and (when routing is on) 404 read as
// pages of the same app rather than disconnected fragments. Deliberately
// theme-aware (var(--card-bg)/var(--border)) rather than hardcoded dark, so
// it's correct in light/dark/system automatically.
export function Navbar() {
  return (
    <header className="navbar">
      <a href="/" className="navbar-brand">
        <span className="navbar-mark" aria-hidden="true" />
        {{projectName}}
      </a>
      <nav className="navbar-links">
        <a href="/">Home</a>
      </nav>
      <ThemeToggle />
    </header>
  );
}
