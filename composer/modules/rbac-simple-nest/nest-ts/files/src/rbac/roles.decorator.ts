import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

// Simple RBAC: a user has exactly one role, and a route just declares which
// role(s) are allowed in.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
