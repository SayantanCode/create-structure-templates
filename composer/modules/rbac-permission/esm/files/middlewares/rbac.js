import { ApiError } from "../utils/ApiError.js";
import { ROLE_PERMISSIONS } from "../config/permissions.js";

// Permission-based RBAC: a route declares which permission it needs, and a
// user's role is looked up against config/permissions.js to see if it grants
// that permission. Requires requireAuth to have already run (so req.user
// exists).
export function requirePermission(...requiredPermissions) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    const granted = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAll = requiredPermissions.every((permission) => granted.includes(permission));
    if (!hasAll) {
      return next(ApiError.forbidden(`Requires permission: ${requiredPermissions.join(", ")}`));
    }
    next();
  };
}
