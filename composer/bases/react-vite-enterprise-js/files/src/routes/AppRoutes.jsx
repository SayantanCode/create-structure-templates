import { Suspense } from "react";
import { Routes, Route, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { BlankLayout } from "@/layouts/BlankLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { PermissionRoute } from "@/routes/PermissionRoute";
import { getRouteRegistry } from "@/routes/routeRegistry";
import { LoadingScreen } from "@/shared/ui";
import { ROUTES } from "@/constants/routes";

const registry = getRouteRegistry();
const dashboardRoutesList = registry.filter((r) => r.layout === "dashboard");
const authRoutesList = registry.filter((r) => r.layout === "auth");

function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        404
      </Typography>
      <Typography color="text.secondary">This page doesn't exist.</Typography>
      <Button component={RouterLink} to={ROUTES.HOME} variant="contained">
        Back home
      </Button>
    </Box>
  );
}

// Groups routeRegistry entries by layout and applies the right guard per
// entry — ProtectedRoute (+ optional PermissionRoute) for dashboard pages,
// PublicRoute for auth pages — all under one Suspense boundary for the
// lazy-loaded feature routes (see features/contacts/routes.jsx).
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen fullScreen />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {dashboardRoutesList.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.permission ? (
                    <PermissionRoute permission={route.permission}>{route.element}</PermissionRoute>
                  ) : (
                    route.element
                  )
                }
              />
            ))}
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            {authRoutesList.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route element={<BlankLayout />}>
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
