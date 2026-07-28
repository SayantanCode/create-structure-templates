import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <span role="status" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <CircularProgress size={18} />
      <Typography variant="body2" color="text.secondary" component="span">
        {label}
      </Typography>
    </span>
  );
}
