import Chip from "@mui/material/Chip";

const VARIANT_BY_STATUS = {
  success: "success",
  active: "success",
  warning: "warning",
  pending: "warning",
  error: "error",
  inactive: "error",
  info: "info",
  neutral: "default",
};

// <StatusChip status="active" /> — maps a business status string to a
// consistent color everywhere it's shown, instead of every table column
// picking its own Chip color.
export function StatusChip({ status, label }) {
  const color = VARIANT_BY_STATUS[status] || "default";
  return <Chip size="small" color={color} label={label || status} />;
}
