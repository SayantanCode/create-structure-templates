import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// `fullScreen` covers the viewport (route-level Suspense fallback);
// otherwise it just centers within its parent (a table/card body loading state).
export function LoadingScreen({ fullScreen = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: fullScreen ? 0 : 6,
        height: fullScreen ? "100vh" : "auto",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
