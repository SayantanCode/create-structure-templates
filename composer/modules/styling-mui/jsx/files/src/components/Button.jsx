import MuiButton from "@mui/material/Button";

export function Button({ children, ...props }) {
  return (
    <MuiButton variant="contained" {...props}>
      {children}
    </MuiButton>
  );
}
