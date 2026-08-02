import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

export function RHFTextarea({ name, control, label, rules, helperText, minRows = 3, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          multiline
          minRows={minRows}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          {...rest}
        />
      )}
    />
  );
}
