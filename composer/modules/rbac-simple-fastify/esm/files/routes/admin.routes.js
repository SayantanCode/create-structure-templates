import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { apiResponse } from "../utils/apiResponse.js";

// Example of an admin-only route — copy this pattern for your own protected
// routes: requireAuth first (so request.user exists), then requireRole(...).
export default async function adminRoutes(fastify, _opts) {
  fastify.get(
    "/admin-check",
    { preHandler: [requireAuth, requireRole("admin")] },
    async (request, reply) => {
      apiResponse.success(reply, { message: "You are an admin.", userId: request.user.sub });
    }
  );
}
