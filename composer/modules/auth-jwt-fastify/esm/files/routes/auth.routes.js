import * as authController from "../controllers/auth.controller.js";
import { validateWith } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { requireAuth } from "../middlewares/auth.js";

// Rate limits below apply per-route since @fastify/rate-limit is registered
// with `global: false` in app.js — every other route stays unthrottled.
const authRateLimit = { rateLimit: { max: 20, timeWindow: "15 minutes" } };

export default async function authRoutes(fastify, _opts) {
  fastify.post(
    "/register",
    { preHandler: validateWith(registerSchema), config: authRateLimit },
    authController.register
  );
  fastify.post(
    "/login",
    { preHandler: validateWith(loginSchema), config: authRateLimit },
    authController.login
  );
  fastify.post("/refresh", authController.refresh);
  fastify.post("/logout", authController.logout);
  fastify.get("/me", { preHandler: requireAuth }, authController.me);
}
