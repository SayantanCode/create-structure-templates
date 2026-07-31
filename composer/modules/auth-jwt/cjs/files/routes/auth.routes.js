const { Router } = require("express");
const authController = require("../controllers/auth.controller.js");
const { validateWith } = require("../middlewares/validate.js");
const { registerSchema, loginSchema } = require("../validators/auth.validator.js");
const { requireAuth } = require("../middlewares/auth.js");
const { authLimiter } = require("../middlewares/rateLimiter.js");

const router = Router();

router.post("/register", authLimiter, validateWith(registerSchema), authController.register);
router.post("/login", authLimiter, validateWith(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;
