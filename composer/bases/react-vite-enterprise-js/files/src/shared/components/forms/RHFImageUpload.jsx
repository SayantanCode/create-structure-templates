import { useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import FormHelperText from "@mui/material/FormHelperText";
import { CloudUploadIcon } from "@/shared/icons";

// A small inner component (not inline logic in the render prop) so its
// object-URL memoization/cleanup follows normal hook rules.
function ImagePreview({ value }) {
  const objectUrl = useMemo(() => (value instanceof File ? URL.createObjectURL(value) : null), [value]);
  useEffect(() => () => objectUrl && URL.revokeObjectURL(objectUrl), [objectUrl]);
  const src = objectUrl || (typeof value === "string" ? value : undefined);
  return <Avatar src={src} sx={{ width: 56, height: 56 }} variant="rounded" />;
}

// Stores the raw File in form state — your submit handler decides how to
// actually upload it (multipart body, presigned URL, ...); this component
// only handles picking one and previewing it. `value` may also already be a
// URL string (editing a record that already has an image).
export function RHFImageUpload({ name, control, label, rules, helperText }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ImagePreview value={field.value} />
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
              {label || "Upload image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              />
            </Button>
          </Box>
          {(fieldState.error?.message || helperText) && (
            <FormHelperText error={Boolean(fieldState.error)}>
              {fieldState.error?.message || helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
