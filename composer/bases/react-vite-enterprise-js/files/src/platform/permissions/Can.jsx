import { usePermission } from "@/platform/permissions/usePermission";

// Declarative guard for UI: <Can permission={PERMISSIONS.CONTACTS_DELETE}><Button/></Can>.
// Renders nothing (or `fallback`) instead of the children when the current
// user lacks the permission — use this for hiding actions; use
// routes/PermissionRoute for gating whole pages.
export function Can({ permission, fallback = null, children }) {
  const allowed = usePermission(permission);
  return allowed ? children : fallback;
}
