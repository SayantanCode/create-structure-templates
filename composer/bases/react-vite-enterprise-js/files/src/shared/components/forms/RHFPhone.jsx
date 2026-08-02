import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

// Deliberately light-touch: restricts input to phone-safe characters and
// relies on shared/validators' isPhone for real validation, instead of
// pulling in a phone-formatting library to guess one country's format.
export function RHFPhone({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type="tel"
          label={label}
          onChange={(e) => field.onChange(e.target.value.replace(/[^\d+\-() ]/g, ""))}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          {...rest}
        />
      )}
    />
  );
}
