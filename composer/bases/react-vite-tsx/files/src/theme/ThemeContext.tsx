import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "theme-mode";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystemPreference(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Adding a 4th theme later: add a new `[data-theme="x"]` block to index.css
// (alongside the light/dark ones already there) and a new option in
// ThemeToggle — this provider doesn't need to change.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system"
  );

  useEffect(() => {
    function applyTheme() {
      const effective = mode === "system" ? resolveSystemPreference() : mode;
      document.documentElement.setAttribute("data-theme", effective);
    }
    applyTheme();

    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [mode]);

  function setMode(next: ThemeMode) {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
