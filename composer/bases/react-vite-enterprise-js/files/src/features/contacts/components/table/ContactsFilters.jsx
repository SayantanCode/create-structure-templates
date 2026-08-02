import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export function ContactsFilters({ companies, company, onCompanyChange }) {
  return (
    <TextField
      select
      label="Company"
      value={company}
      onChange={(e) => onCompanyChange(e.target.value)}
      size="small"
      sx={{ minWidth: 200, mb: 2 }}
    >
      <MenuItem value="">All companies</MenuItem>
      {companies.map((c) => (
        <MenuItem key={c} value={c}>
          {c}
        </MenuItem>
      ))}
    </TextField>
  );
}
