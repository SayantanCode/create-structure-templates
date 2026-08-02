import { useState } from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { formatCurrency, parseNumeric } from "@/shared/utils/formatters";

// Stores a plain number in form state; displays the formatted currency
// string while unfocused and the raw number while typing (formatting every
// keystroke would fight the cursor position).
export function RHFCurrency({ name, control, label, rules, helperText, currency = "USD", ...rest }) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          label={label}
          value={focused ? (field.value ?? "") : formatCurrency(field.value, currency)}
          onChange={(e) => field.onChange(parseNumeric(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            field.onBlur();
          }}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
          {...rest}
        />
      )}
    />
  );
}
