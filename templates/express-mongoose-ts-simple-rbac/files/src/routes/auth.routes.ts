import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateWith } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateWith(registerSchema), authController.register);
router.post("/login", validateWith(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
