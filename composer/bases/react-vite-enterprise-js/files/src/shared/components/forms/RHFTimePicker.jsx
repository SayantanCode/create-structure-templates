import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

// Native `<input type="time">` — see RHFDatePicker for why this base uses
// native pickers instead of @mui/x-date-pickers. Value is a plain "HH:mm"
// string.
export function RHFTimePicker({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value || ""}
          type="time"
          label={label}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...rest}
        />
      )}
    />
  );
}
