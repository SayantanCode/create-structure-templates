import { Controller } from "react-hook-form";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

export function RHFSwitch({ name, control, label, rules, ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControlLabel
          control={<Switch {...field} checked={Boolean(field.value)} {...rest} />}
          label={label}
        />
      )}
    />
  );
}
