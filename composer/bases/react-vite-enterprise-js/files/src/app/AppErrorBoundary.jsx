import { Component } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { logger } from "@/services/logging/logger";

export class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Extend this to report to a real error-tracking service (Sentry, etc.)
    // in production.
    logger.error("Unhandled render error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: 2,
            textAlign: "center",
            px: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Something went wrong.
          </Typography>
          <Typography color="text.secondary">Try reloading the page.</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
