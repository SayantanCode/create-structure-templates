import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingScreen } from "@/shared/ui";
import { ROUTES } from "@/constants/routes";

// Gates every dashboard-layout route. `initializing` (still checking a
// token found in storage — see authSlice's bootstrapAuth) shows a loading
// screen instead of bouncing to /login and back once the check resolves.
export function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <LoadingScreen fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;

  return <Outlet />;
}
