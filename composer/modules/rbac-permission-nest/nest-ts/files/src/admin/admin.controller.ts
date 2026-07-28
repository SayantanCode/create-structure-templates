import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { PermissionsGuard } from "../rbac/permissions.guard";
import { RequirePermissions } from "../rbac/permissions.decorator";

// Example of a permission-protected route — copy this pattern for your own
// protected routes: JwtAuthGuard first (so request.user exists), then
// PermissionsGuard + @RequirePermissions(...).
@Controller()
export class AdminController {
  @Get("admin-check")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("admin:access")
  adminCheck(@CurrentUser("sub") userId: string) {
    return { message: "You are an admin.", userId };
  }
}
