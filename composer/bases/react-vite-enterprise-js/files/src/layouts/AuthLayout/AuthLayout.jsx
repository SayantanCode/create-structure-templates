import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { env } from "@/config/env";

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, width: "100%", maxWidth: 420 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {env.appName}
        </Typography>
        <Outlet />
      </Paper>
    </Box>
  );
}
