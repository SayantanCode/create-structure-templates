import { ROLES } from "@/constants/roles";

// Every permission key the app checks against. Keep these as verb:resource
// pairs so new features can add their own without colliding with existing ones.
export const PERMISSIONS = {
  CONTACTS_VIEW: "contacts:view",
  CONTACTS_CREATE: "contacts:create",
  CONTACTS_EDIT: "contacts:edit",
  CONTACTS_DELETE: "contacts:delete",
};

// Which roles hold which permissions. platform/permissions/permissions.js's
// can() reads this map — add a new role or permission here, nothing else
// needs to change to start enforcing it.
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [PERMISSIONS.CONTACTS_VIEW, PERMISSIONS.CONTACTS_CREATE, PERMISSIONS.CONTACTS_EDIT],
  [ROLES.MEMBER]: [PERMISSIONS.CONTACTS_VIEW],
};
