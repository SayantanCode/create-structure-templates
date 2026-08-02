import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

// A native `<input type="date">` rather than @mui/x-date-pickers — every
// modern browser ships a real date picker for it, and it avoids a peer
// dependency that (as of this base's pinned MUI version) doesn't support
// MUI's latest major yet. Value is a plain "YYYY-MM-DD" string; use
// shared/lib/dateLib's formatDate() to display it elsewhere.
export function RHFDatePicker({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value || ""}
          type="date"
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
