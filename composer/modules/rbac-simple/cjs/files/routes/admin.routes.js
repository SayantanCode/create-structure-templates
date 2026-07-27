const { Router } = require("express");
const { requireAuth } = require("../middlewares/auth.js");
const { requireRole } = require("../middlewares/rbac.js");
const { apiResponse } = require("../utils/apiResponse.js");

const router = Router();

// Example of an admin-only route — copy this pattern for your own protected
// routes: requireAuth first (so req.user exists), then requireRole(...).
router.get("/admin-check", requireAuth, requireRole("admin"), (req, res) => {
  apiResponse.success(res, { message: "You are an admin.", userId: req.user.sub });
});

module.exports = router;
