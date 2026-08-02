import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

// Native `<input type="datetime-local">` — see RHFDatePicker for why this
// base uses native pickers instead of @mui/x-date-pickers. Value is a
// plain "YYYY-MM-DDTHH:mm" string.
export function RHFDateTimePicker({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value || ""}
          type="datetime-local"
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
