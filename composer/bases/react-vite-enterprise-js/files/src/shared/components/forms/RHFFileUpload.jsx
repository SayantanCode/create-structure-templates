import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { CloudUploadIcon } from "@/shared/icons";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Same idea as RHFImageUpload but for any file type, with a filename +
// size readout instead of an image preview. Pass `accept` to restrict
// (e.g. "application/pdf").
export function RHFFileUpload({ name, control, label, rules, helperText, accept }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
              {label || "Upload file"}
              <input
                type="file"
                accept={accept}
                hidden
                onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              />
            </Button>
            {field.value instanceof File && (
              <Typography variant="body2" color="text.secondary">
                {field.value.name} ({formatFileSize(field.value.size)})
              </Typography>
            )}
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
