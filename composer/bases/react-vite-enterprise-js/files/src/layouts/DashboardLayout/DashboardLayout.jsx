import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import { MainLayout } from "@/layouts/MainLayout";
import { Sidebar } from "@/layouts/DashboardLayout/Sidebar";

// Composes MainLayout (Header/Footer) instead of re-declaring its own —
// only adds what's actually different here, the Sidebar. Access control
// (ProtectedRoute) is applied at the route level in routes/AppRoutes.jsx,
// not baked in here — a layout's job is presentation, not guarding.
export function DashboardLayout() {
  return (
    <MainLayout>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </MainLayout>
  );
}
