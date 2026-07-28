import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export function Button({ children, ...props }: MuiButtonProps) {
  return (
    <MuiButton variant="contained" {...props}>
      {children}
    </MuiButton>
  );
}
