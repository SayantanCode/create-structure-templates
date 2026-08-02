import { ReactNode } from "react";
import { useTheme, ThemeMode } from "@/theme/ThemeContext";

const OPTIONS: { mode: ThemeMode; label: string; icon: ReactNode }[] = [
  {
    mode: "light",
    label: "Light",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    mode: "dark",
    label: "Dark",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    ),
  },
  {
    mode: "system",
    label: "System",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 20h8M12 17v3" />
      </svg>
    ),
  },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt.mode}
          type="button"
          className={`theme-toggle-btn ${mode === opt.mode ? "active" : ""}`}
          aria-pressed={mode === opt.mode}
          title={opt.label}
          onClick={() => setMode(opt.mode)}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
