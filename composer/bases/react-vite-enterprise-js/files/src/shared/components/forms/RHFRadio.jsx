import { Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";

// `options`: [{ value, label }].
export function RHFRadio({ name, control, label, rules, helperText, options, row = false }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)}>
          {label && <FormLabel>{label}</FormLabel>}
          <RadioGroup {...field} row={row}>
            {options.map((option) => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
