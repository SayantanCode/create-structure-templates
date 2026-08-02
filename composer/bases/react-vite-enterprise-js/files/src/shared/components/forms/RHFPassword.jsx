import { useState } from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { VisibilityIcon, VisibilityOffIcon } from "@/shared/icons";

// RHFInput plus the show/hide toggle every password field needs — one
// place, instead of every login/register/change-password form
// re-implementing the same eye-icon toggle.
export function RHFPassword({ name, control, label, rules, helperText, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={visible ? "text" : "password"}
          label={label}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helperText}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setVisible((v) => !v)}
                    edge="end"
                    aria-label={visible ? "Hide password" : "Show password"}
                  >
                    {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...rest}
        />
      )}
    />
  );
}
