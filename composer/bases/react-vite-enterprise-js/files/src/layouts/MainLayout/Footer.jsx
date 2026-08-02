import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { env } from "@/config/env";

export function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: "center", borderTop: "1px solid", borderColor: "divider" }}>
      <Typography variant="body2" color="text.secondary">
        {env.appName} — built with create-structure.
      </Typography>
    </Box>
  );
}
