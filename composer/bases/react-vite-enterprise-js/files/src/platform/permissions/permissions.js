import { ROLE_PERMISSIONS } from "@/constants/permissions";

// Pure — no React/Redux here on purpose, so it's trivially unit-testable
// (see tests/unit/permissions.test.js) and reusable anywhere a user +
// permission pair needs checking, not just inside a component.
export function can(user, permission) {
  if (!user || !user.role) return false;
  const granted = ROLE_PERMISSIONS[user.role] || [];
  return granted.includes(permission);
}

export function canAny(user, permissions) {
  return permissions.some((permission) => can(user, permission));
}

export function canAll(user, permissions) {
  return permissions.every((permission) => can(user, permission));
}
