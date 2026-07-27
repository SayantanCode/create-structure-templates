import * as authController from "../controllers/auth.controller.js";
import { validateWith } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { requireAuth } from "../middlewares/auth.js";

export default async function authRoutes(fastify, _opts) {
  fastify.post("/register", { preHandler: validateWith(registerSchema) }, authController.register);
  fastify.post("/login", { preHandler: validateWith(loginSchema) }, authController.login);
  fastify.post("/refresh", authController.refresh);
  fastify.post("/logout", authController.logout);
  fastify.get("/me", { preHandler: requireAuth }, authController.me);
}
