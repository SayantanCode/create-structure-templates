import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { SearchIcon, AddIcon } from "@/shared/icons";

export function ContactsToolbar({ query, onQueryChange, onCreate }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", mb: 2 }}>
      <TextField
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search contacts..."
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 260 }}
      />
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
        New Contact
      </Button>
    </Stack>
  );
}
