import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" role="status">
      <CircularProgress size={18} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}
