import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateWith } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/rbac.js";

const router = Router();

// Reading the user list needs the users:read permission (every role has it
// by default, see config/permissions.js); mutating it (this is admin
// user-management, distinct from self-service /auth routes) needs the more
// specific create/update/delete permissions.
router.get("/", requireAuth, requirePermission("users:read"), userController.listUsers);
router.get("/:id", requireAuth, requirePermission("users:read"), userController.getUserById);
router.post(
  "/",
  requireAuth,
  requirePermission("users:create"),
  validateWith(createUserSchema),
  userController.createUser
);
router.patch(
  "/:id",
  requireAuth,
  requirePermission("users:update"),
  validateWith(updateUserSchema),
  userController.updateUser
);
router.delete("/:id", requireAuth, requirePermission("users:delete"), userController.deleteUser);

export default router;
