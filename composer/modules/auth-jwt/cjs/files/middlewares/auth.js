const { ApiError } = require("../utils/ApiError.js");
const { verifyAccessToken } = require("../utils/jwt.js");

// Verifies the access token in the Authorization header and attaches the
// decoded payload as req.user. Route handlers/RBAC middleware read
// req.user.sub (the user id) and req.user.role from here.
function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or malformed Authorization header"));
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired access token"));
  }
}

module.exports = { requireAuth };
