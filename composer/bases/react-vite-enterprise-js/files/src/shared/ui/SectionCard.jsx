import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// The one reusable "card with a title" every dashboard/detail page uses for
// grouping content — table cards, form cards, stat groupings, all the same shell.
export function SectionCard({ title, actions, children, sx }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, ...sx }}>
      {(title || actions) && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          {title && (
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          )}
          {actions}
        </Box>
      )}
      {children}
    </Paper>
  );
}
