import { describe, it, expect } from "vitest";
import { can, canAny, canAll } from "@/platform/permissions/permissions";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";

describe("can", () => {
  it("returns false for a null user", () => {
    expect(can(null, PERMISSIONS.CONTACTS_VIEW)).toBe(false);
  });

  it("returns false when the user's role lacks the permission", () => {
    const user = { role: ROLES.MEMBER };
    expect(can(user, PERMISSIONS.CONTACTS_DELETE)).toBe(false);
  });

  it("returns true when the user's role has the permission", () => {
    const user = { role: ROLES.ADMIN };
    expect(can(user, PERMISSIONS.CONTACTS_DELETE)).toBe(true);
  });
});

describe("canAny / canAll", () => {
  const manager = { role: ROLES.MANAGER };

  it("canAny is true if at least one permission matches", () => {
    expect(canAny(manager, [PERMISSIONS.CONTACTS_DELETE, PERMISSIONS.CONTACTS_VIEW])).toBe(true);
  });

  it("canAll is false if any permission is missing", () => {
    expect(canAll(manager, [PERMISSIONS.CONTACTS_DELETE, PERMISSIONS.CONTACTS_VIEW])).toBe(false);
  });
});
