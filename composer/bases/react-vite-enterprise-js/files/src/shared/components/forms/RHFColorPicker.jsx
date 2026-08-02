import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// Native <input type="color"> (every modern browser ships a real color
// picker for it) paired with a hex text field kept in sync — no separate
// color-picker package.
export function RHFColorPicker({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="input"
            type="color"
            value={field.value || "#000000"}
            onChange={(e) => field.onChange(e.target.value)}
            sx={{
              width: 40,
              height: 40,
              p: 0,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
              background: "none",
            }}
          />
          <TextField
            label={label}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message || helperText}
            placeholder="#6366f1"
            fullWidth
            {...rest}
          />
        </Box>
      )}
    />
  );
}
