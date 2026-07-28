import TextField, { TextFieldProps } from "@mui/material/TextField";

export function Input(props: TextFieldProps) {
  return <TextField variant="outlined" size="small" fullWidth {...props} />;
}
