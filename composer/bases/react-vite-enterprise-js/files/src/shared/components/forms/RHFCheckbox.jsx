import { Controller } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

export function RHFCheckbox({ name, control, label, rules, helperText, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          <FormControlLabel
            control={<Checkbox {...field} checked={Boolean(field.value)} {...rest} />}
            label={label}
          />
          {(fieldState.error?.message || helperText) && (
            <FormHelperText error={Boolean(fieldState.error)}>
              {fieldState.error?.message || helperText}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
