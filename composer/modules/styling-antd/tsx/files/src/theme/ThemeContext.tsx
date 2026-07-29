import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

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

// Drives both antd's own ConfigProvider (algorithm: darkAlgorithm/
// defaultAlgorithm — repaints every antd component) and the data-theme
// attribute the base's App.css reads (so the shared hero/badge/showcase-card
// chrome, which isn't an antd component, stays visually in sync). Unlike
// MUI's CssBaseline, antd's ConfigProvider never touches the <body>
// background, so there's no gradient-hero conflict to work around here.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system"
  );
  const [systemPref, setSystemPref] = useState<"light" | "dark">(resolveSystemPreference);

  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemPref(resolveSystemPreference());
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mode]);

  const effective = mode === "system" ? systemPref : mode;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effective);
  }, [effective]);

  function setMode(next: ThemeMode) {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ConfigProvider
        theme={{ algorithm: effective === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
