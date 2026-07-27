import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { apiResponse } from "../utils/apiResponse.js";

const router = Router();

// Example of an admin-only route — copy this pattern for your own protected
// routes: requireAuth first (so req.user exists), then requireRole(...).
router.get("/admin-check", requireAuth, requireRole("admin"), (req, res) => {
  apiResponse.success(res, { message: "You are an admin.", userId: req.user.sub });
});

export default router;
