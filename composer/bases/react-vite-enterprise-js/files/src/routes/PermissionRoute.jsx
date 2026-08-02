import { Navigate } from "react-router-dom";
import { usePermission } from "@/platform/permissions";
import { ROUTES } from "@/constants/routes";

// Gates an entire page. Compare with platform/permissions' <Can>, which
// hides one UI element rather than redirecting away from a whole route.
export function PermissionRoute({ permission, children }) {
  const allowed = usePermission(permission);
  if (!allowed) return <Navigate to={ROUTES.HOME} replace />;
  return children;
}
