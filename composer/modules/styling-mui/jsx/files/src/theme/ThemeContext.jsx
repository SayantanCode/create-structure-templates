import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

const STORAGE_KEY = "theme-mode";
const ThemeContext = createContext(null);

function resolveSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Drives two things at once from the same mode: MUI's own ThemeProvider
// (so MUI components actually repaint) and the data-theme attribute the
// base's App.css reads (so the shared hero/badge/showcase-card chrome —
// which isn't a MUI component — stays visually in sync rather than
// looking stuck on the other theme). Deliberately skips MUI's CssBaseline:
// it injects its own body background from theme.palette.background.default,
// which would fight the gradient hero background set in index.css.
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

  const theme = useMemo(() => createTheme({ palette: { mode: effective } }), [effective]);

  function setMode(next) {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
