import { ApiError } from "../utils/ApiError.js";

// Simple RBAC: a user has exactly one role, and a route just declares which
// role(s) are allowed in. Requires requireAuth to have already run (so
// req.user exists).
export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Requires role: ${allowedRoles.join(" or ")}`));
    }
    next();
  };
}
