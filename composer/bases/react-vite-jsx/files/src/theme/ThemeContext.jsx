import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "theme-mode";
const ThemeContext = createContext(null);

function resolveSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Adding a 4th theme later: add a new `[data-theme="x"]` block to index.css
// (alongside the light/dark ones already there) and a new option in
// ThemeToggle — this provider doesn't need to change.
export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => localStorage.getItem(STORAGE_KEY) || "system");

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

  function setMode(next) {
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
