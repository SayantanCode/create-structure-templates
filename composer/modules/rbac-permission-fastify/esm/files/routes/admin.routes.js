import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/rbac.js";
import { apiResponse } from "../utils/apiResponse.js";

// Example of a permission-gated route — copy this pattern for your own
// protected routes: requireAuth first (so request.user exists), then
// requirePermission(...).
export default async function adminRoutes(fastify, _opts) {
  fastify.get(
    "/admin-check",
    { preHandler: [requireAuth, requirePermission("admin:access")] },
    async (request, reply) => {
      apiResponse.success(reply, { message: "You have admin:access.", userId: request.user.sub });
    }
  );
}
