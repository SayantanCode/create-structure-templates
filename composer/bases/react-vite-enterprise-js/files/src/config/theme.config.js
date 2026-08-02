// MUI theme tokens, kept separate from the provider that consumes them
// (shared/providers/AppThemeProvider.jsx) so palette/typography changes
// don't require touching provider wiring code.
export function getThemeOptions(mode) {
  const isDark = mode === "dark";
  return {
    palette: {
      mode,
      primary: { main: "#6366f1" },
      secondary: { main: "#a855f7" },
      background: {
        default: isDark ? "#0f1117" : "#f7f7fb",
        paper: isDark ? "#171923" : "#ffffff",
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  };
}
