// Permission-based RBAC: a role maps to a list of permissions, and routes
// declare which permission they need rather than which role. Add a new role
// or tighten/loosen what an existing role can do by editing this map only —
// nothing else needs to change.
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["admin:access"],
  user: [],
};
