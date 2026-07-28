import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>
        Edit <code>src/pages/Home.jsx</code> to get started.
      </p>
      <Link to="/this-route-does-not-exist">Broken link (see the 404 page)</Link>
    </div>
  );
}
