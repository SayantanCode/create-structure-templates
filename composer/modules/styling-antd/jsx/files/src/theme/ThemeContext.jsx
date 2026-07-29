import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

const STORAGE_KEY = "theme-mode";
const ThemeContext = createContext(null);

function resolveSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Drives both antd's own ConfigProvider (algorithm: darkAlgorithm/
// defaultAlgorithm — repaints every antd component) and the data-theme
// attribute the base's App.css reads (so the shared hero/badge/showcase-card
// chrome, which isn't an antd component, stays visually in sync). Unlike
// MUI's CssBaseline, antd's ConfigProvider never touches the <body>
// background, so there's no gradient-hero conflict to work around here.
export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => localStorage.getItem(STORAGE_KEY) || "system");
  const [systemPref, setSystemPref] = useState(resolveSystemPreference);

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

  function setMode(next) {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ConfigProvider
        theme={{
          algorithm: effective === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        }}
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
