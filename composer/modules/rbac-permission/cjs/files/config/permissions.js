// Permission-based RBAC: a role maps to a list of permissions, and routes
// declare which permission they need rather than which role. Add a new role
// or tighten/loosen what an existing role can do by editing this map only —
// nothing else needs to change.
const ROLE_PERMISSIONS = {
  admin: ["admin:access"],
  user: [],
};

module.exports = { ROLE_PERMISSIONS };
