import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

// A real, separate page (not a fragment squeezed into the showcase card) —
// its own background, its own illustration. The SVG below is an original,
// theme-aware "lost in space" motif (uses the same --accent/--accent-2
// gradient as the rest of the brand) rather than a literal illustration.
function SpaceIllustration() {
  return (
    <svg
      className="notfound-illustration"
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nfGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nfPlanet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="160" r="150" fill="url(#nfGlow)" />

      <g className="notfound-orbit">
        <ellipse
          cx="160"
          cy="168"
          rx="118"
          ry="26"
          stroke="var(--border)"
          strokeWidth="2"
          opacity="0.7"
          transform="rotate(-8 160 168)"
        />
        <circle cx="160" cy="150" r="68" fill="url(#nfPlanet)" />
        <path
          d="M 44 172 A 118 26 -8 0 0 276 164"
          stroke="var(--accent-2)"
          strokeWidth="2.5"
          opacity="0.55"
        />
      </g>

      <g className="notfound-stars" fill="var(--muted)">
        <circle cx="42" cy="58" r="2.5" />
        <circle cx="268" cy="48" r="2" />
        <circle cx="288" cy="140" r="1.8" />
        <circle cx="32" cy="228" r="2" />
        <circle cx="82" cy="278" r="1.6" />
        <circle cx="250" cy="268" r="2.4" />
      </g>

      <circle cx="58" cy="122" r="7" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="256" cy="222" r="9" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="1.5" />
    </svg>
  );
}

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-text">
          <p className="notfound-code gradient-text">404</p>
          <h2>Page not found</h2>
          <p className="subtitle">
            The page you're looking for doesn't exist or has moved.
          </p>
          <Button onClick={() => navigate("/")}>Back home</Button>
        </div>
        <SpaceIllustration />
      </div>
    </div>
  );
}
