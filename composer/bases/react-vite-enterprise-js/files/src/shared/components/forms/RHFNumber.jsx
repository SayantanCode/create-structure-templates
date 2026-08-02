import { useState } from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { formatNumber, parseNumeric } from "@/shared/utils/formatters";

// Same focused/unfocused formatting approach as RHFCurrency, without the
// currency symbol.
export function RHFNumber({ name, control, label, rules, helperText, ...rest }) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          label={label}
          value={focused ? (field.value ?? "") : formatNumber(field.value)}
          onChange={(e) => field.onChange(parseNumeric(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            field.onBlur();
          }}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          slotProps={{ htmlInput: { inputMode: "decimal" } }}
          {...rest}
        />
      )}
    />
  );
}
