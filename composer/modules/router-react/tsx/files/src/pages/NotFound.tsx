import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <p className="not-found-code gradient-text">404</p>
      <h2>Page not found</h2>
      <p className="subtitle">The page you're looking for doesn't exist or has moved.</p>
      <Button onClick={() => navigate("/")}>Back home</Button>
    </div>
  );
}
