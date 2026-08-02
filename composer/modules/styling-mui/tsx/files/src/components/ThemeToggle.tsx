import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useTheme, ThemeMode } from "@/theme/ThemeContext";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      size="small"
      aria-label="Theme"
      onChange={(_e, next: ThemeMode | null) => next && setMode(next)}
      sx={{ position: "fixed", top: 16, right: 16, zIndex: 100, bgcolor: "background.paper" }}
    >
      <ToggleButton value="light" aria-label="Light">
        <LightModeIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="Dark">
        <DarkModeIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="system" aria-label="System">
        <SettingsBrightnessIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
