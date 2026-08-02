import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// `options`: [{ value, label }]. Stores just the `value` in form state (not
// the whole option object) — pass `multiple` to select more than one.
export function RHFAutocomplete({ name, control, label, rules, helperText, options, multiple = false, ...rest }) {
  const getOption = (value) => options.find((o) => o.value === value) || null;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          multiple={multiple}
          options={options}
          getOptionLabel={(option) => option.label ?? ""}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={multiple ? (field.value || []).map(getOption).filter(Boolean) : getOption(field.value)}
          onChange={(_event, selected) => {
            field.onChange(multiple ? (selected || []).map((o) => o.value) : (selected?.value ?? null));
          }}
          onBlur={field.onBlur}
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
