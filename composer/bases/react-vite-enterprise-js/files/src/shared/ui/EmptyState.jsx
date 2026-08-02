import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InboxIcon } from "@/shared/icons";

// The "no data yet" state every table/list needs instead of just rendering
// nothing — <EmptyState message="No contacts yet." action={<Button.../>} />.
export function EmptyState({ message = "Nothing here yet.", action }) {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      <InboxIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
      <Typography variant="body1" sx={{ mb: action ? 2 : 0 }}>
        {message}
      </Typography>
      {action}
    </Box>
  );
}
