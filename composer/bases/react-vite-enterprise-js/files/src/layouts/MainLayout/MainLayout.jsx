import Box from "@mui/material/Box";
import { Header } from "@/layouts/MainLayout/Header";
import { Footer } from "@/layouts/MainLayout/Footer";

// Owns the Header/Footer chrome. Takes `children` rather than rendering its
// own <Outlet/> so DashboardLayout can compose it (Header/Footer plus its
// own Sidebar around the routed content) instead of re-declaring a second
// header/footer — see this base's README for why.
export function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>{children}</Box>
      <Footer />
    </Box>
  );
}
