import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

// Overwrites the base's Navbar (same file path) with one that uses
// react-router's <Link> instead of a plain <a> — client-side navigation
// instead of a full page reload, now that there's actually more than one
// page to navigate between.
export function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-mark" aria-hidden="true" />
        {{projectName}}
      </Link>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
      </nav>
      <ThemeToggle />
    </header>
  );
}
