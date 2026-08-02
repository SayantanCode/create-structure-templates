import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { DashboardIcon, ContactsIcon } from "@/shared/icons";
import { ROUTES } from "@/constants/routes";
import { getPluginMenuItems } from "@/platform/plugins";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", to: ROUTES.HOME, icon: DashboardIcon },
  { label: "Contacts", to: ROUTES.CONTACTS, icon: ContactsIcon },
];

// Plugin-contributed menu items (see platform/plugins) merge in alongside
// the base-owned nav items — a plugin never has to fork/patch this file.
export function Sidebar() {
  const { pathname } = useLocation();
  const items = [...navItems, ...getPluginMenuItems()];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          position: "relative",
          border: "none",
        },
      }}
    >
      <List sx={{ pt: 2 }}>
        {items.map(({ label, to, icon: Icon }) => (
          <ListItemButton key={to} component={RouterLink} to={to} selected={pathname === to}>
            {Icon && (
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
            )}
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
