import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

// Free-text tags — stores string[] in form state. `options` (optional)
// seeds autocomplete suggestions; freeSolo still lets the user type
// anything not in the list.
export function RHFTagInput({ name, control, label, rules, helperText, options = [], ...rest }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          multiple
          freeSolo
          options={options}
          value={field.value || []}
          onChange={(_event, value) => field.onChange(value)}
          onBlur={field.onBlur}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <Chip key={key} label={option} size="small" {...tagProps} />;
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message || helperText}
            />
          )}
          {...rest}
        />
      )}
    />
  );
}
