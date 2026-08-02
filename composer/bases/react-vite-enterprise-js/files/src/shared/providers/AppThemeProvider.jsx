import { createContext, useContext, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getThemeOptions } from "@/config/theme.config";

const ThemeModeContext = createContext(null);

// Context + its Provider (and the MUI theme it drives) live in one file —
// see the "shared/contexts folded into shared/providers" decision in this
// base's README for why this project doesn't split them into two folders.
export function AppThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage(STORAGE_KEYS.THEME_MODE, "light");
  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  const value = useMemo(
    () => ({ mode, setMode, toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")) }),
    [mode, setMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within an AppThemeProvider");
  return ctx;
}
