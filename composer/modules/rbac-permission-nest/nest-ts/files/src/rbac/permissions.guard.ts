import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { ROLE_PERMISSIONS } from "../config/permissions";

// Requires JwtAuthGuard to have already run (so request.user exists) —
// always list it before this guard in @UseGuards(...).
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    const granted = ROLE_PERMISSIONS[user.role] || [];
    const hasAll = required.every((permission: string) => granted.includes(permission));
    if (!hasAll) {
      throw new ForbiddenException(`Requires permission: ${required.join(", ")}`);
    }
    return true;
  }
}
