const { Router } = require("express");
const { requireAuth } = require("../middlewares/auth.js");
const { requirePermission } = require("../middlewares/rbac.js");
const { apiResponse } = require("../utils/apiResponse.js");

const router = Router();

// Example of a permission-gated route — copy this pattern for your own
// protected routes: requireAuth first (so req.user exists), then
// requirePermission(...).
router.get("/admin-check", requireAuth, requirePermission("admin:access"), (req, res) => {
  apiResponse.success(res, { message: "You have admin:access.", userId: req.user.sub });
});

module.exports = router;
