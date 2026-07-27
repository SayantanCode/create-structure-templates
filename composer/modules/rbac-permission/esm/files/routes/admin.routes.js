import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/rbac.js";
import { apiResponse } from "../utils/apiResponse.js";

const router = Router();

// Example of a permission-gated route — copy this pattern for your own
// protected routes: requireAuth first (so req.user exists), then
// requirePermission(...).
router.get("/admin-check", requireAuth, requirePermission("admin:access"), (req, res) => {
  apiResponse.success(res, { message: "You have admin:access.", userId: req.user.sub });
});

export default router;
