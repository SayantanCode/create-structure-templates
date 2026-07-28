import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RolesGuard } from "../rbac/roles.guard";
import { Roles } from "../rbac/roles.decorator";

// Example of an admin-only route — copy this pattern for your own protected
// routes: JwtAuthGuard first (so request.user exists), then RolesGuard +
// @Roles(...).
@Controller()
export class AdminController {
  @Get("admin-check")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  adminCheck(@CurrentUser("sub") userId: string) {
    return { message: "You are an admin.", userId };
  }
}
