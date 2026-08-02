import { useSelector } from "react-redux";
import { can, canAny, canAll } from "@/platform/permissions/permissions";

// Reads the current user from the auth slice directly (state.auth.user) —
// auth is a base-owned feature, always present in the store, so platform
// code can rely on that shape without importing anything from
// features/auth (infrastructure never reaches into a feature's files).
export function usePermission(permission) {
  const user = useSelector((state) => state.auth.user);
  return can(user, permission);
}

export function usePermissionAny(permissions) {
  const user = useSelector((state) => state.auth.user);
  return canAny(user, permissions);
}

export function usePermissionAll(permissions) {
  const user = useSelector((state) => state.auth.user);
  return canAll(user, permissions);
}
