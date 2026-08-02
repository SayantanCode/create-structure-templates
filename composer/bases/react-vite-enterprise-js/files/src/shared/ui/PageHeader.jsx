import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

// Every feature list/detail page starts with one of these: a title, an
// optional breadcrumb trail (see routes/breadcrumbs.js), and an actions
// slot on the right (e.g. the "New Contact" button).
export function PageHeader({ title, breadcrumbs, actions }) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) =>
            crumb.to && index < breadcrumbs.length - 1 ? (
              <Link key={crumb.label} component={RouterLink} to={crumb.to} underline="hover" color="inherit">
                {crumb.label}
              </Link>
            ) : (
              <Typography key={crumb.label} color="text.primary">
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Stack>
    </Box>
  );
}
