import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateWith } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = Router();

// Reading the user list is fine for any authenticated user; mutating it
// (this is admin user-management, distinct from self-service /auth routes)
// requires the admin role.
router.get("/", requireAuth, userController.listUsers);
router.get("/:id", requireAuth, userController.getUserById);
router.post("/", requireAuth, requireRole("admin"), validateWith(createUserSchema), userController.createUser);
router.patch("/:id", requireAuth, requireRole("admin"), validateWith(updateUserSchema), userController.updateUser);
router.delete("/:id", requireAuth, requireRole("admin"), userController.deleteUser);

export default router;
