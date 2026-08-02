import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { useThemeMode } from "@/shared/providers";
import { DarkModeIcon, LightModeIcon } from "@/shared/icons";
import { ROUTES } from "@/constants/routes";
import { env } from "@/config/env";

export function Header() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          component={RouterLink}
          to={ROUTES.HOME}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          {env.appName}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleMode} aria-label="Toggle theme">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
