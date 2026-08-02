import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebounce } from "@/shared/hooks/useDebounce";

// Same shape as RHFAutocomplete, but `fetchOptions(query)` is called
// instead of a static `options` array — debounced, so typing quickly
// doesn't fire one request per keystroke. `fetchOptions` must return
// `[{ value, label }]`.
export function RHFAsyncAutocomplete({ name, control, label, rules, helperText, fetchOptions, ...rest }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const results = await fetchOptions(debouncedInput);
        if (!cancelled) setOptions(results);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedInput, fetchOptions]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          options={options}
          loading={loading}
          getOptionLabel={(option) => option.label ?? ""}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={options.find((o) => o.value === field.value) || null}
          onInputChange={(_event, value) => setInputValue(value)}
          onChange={(_event, selected) => field.onChange(selected?.value ?? null)}
          onBlur={field.onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message || helperText}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={18} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          {...rest}
        />
      )}
    />
  );
}
