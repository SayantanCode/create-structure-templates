import { ApiError } from "../utils/ApiError.js";

// Simple RBAC: a user has exactly one role, and a route just declares which
// role(s) are allowed in. Requires requireAuth to have already run (so
// request.user exists). Returns a Fastify preHandler.
export function requireRole(...allowedRoles) {
  return async (request, _reply) => {
    if (!request.user) {
      throw ApiError.unauthorized();
    }
    if (!allowedRoles.includes(request.user.role)) {
      throw ApiError.forbidden(`Requires role: ${allowedRoles.join(" or ")}`);
    }
  };
}
