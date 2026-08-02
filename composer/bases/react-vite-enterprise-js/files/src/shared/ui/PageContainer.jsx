import Box from "@mui/material/Box";

// Consistent page-level padding/max-width — every feature page wraps its
// content in this instead of picking its own spacing.
export function PageContainer({ children, sx }) {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto", ...sx }}>{children}</Box>
  );
}
