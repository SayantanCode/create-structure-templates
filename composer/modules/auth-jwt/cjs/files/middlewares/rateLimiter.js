const rateLimit = require("express-rate-limit");

// Login and register are the endpoints most worth throttling — brute-forcing
// passwords or mass-registering accounts costs an attacker nothing without
// this. Keyed by IP by default; swap in a store (e.g. Redis) to share the
// limit across multiple server instances.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many attempts, please try again later.", code: "RATE_LIMITED" } },
});

module.exports = { authLimiter };
