import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div>
      <h2>404 — Page not found</h2>
      <Link to="/">Back home</Link>
    </div>
  );
}
