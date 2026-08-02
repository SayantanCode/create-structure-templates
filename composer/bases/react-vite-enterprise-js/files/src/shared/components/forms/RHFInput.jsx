import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

// Every text field in this app goes through here instead of hand-rolling
// `<Controller control={control} name={...} render={...}>` — pass
// `rules` the same way you'd pass them to RHF's own `register()`.
export function RHFInput({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          {...rest}
        />
      )}
    />
  );
}
