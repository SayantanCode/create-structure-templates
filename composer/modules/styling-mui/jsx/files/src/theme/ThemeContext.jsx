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

  // A stock MUI palette.primary is MUI's default blue, completely
  // disconnected from the indigo/purple accent the hero, badge, and the
  // other styling picks (Tailwind, Ant Design) all use — this keeps the
  // brand color consistent regardless of which styling library is picked,
  // even though the underlying widget shapes stay library-native.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: effective,
          primary: { main: effective === "dark" ? "#818cf8" : "#6366f1" },
        },
      }),
    [effective]
  );

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
