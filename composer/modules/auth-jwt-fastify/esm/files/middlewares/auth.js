import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

// Fastify preHandler: verifies the access token in the Authorization header
// and attaches the decoded payload as request.user. Throwing here is
// automatically routed to the global error handler (setErrorHandler) — no
// next()/callback plumbing needed.
export async function requireAuth(request, _reply) {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or malformed Authorization header");
  }

  const token = header.slice("Bearer ".length);

  try {
    request.user = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired access token");
  }
}
