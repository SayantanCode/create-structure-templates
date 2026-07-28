import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { verifyAccessToken } from "../jwt.util";

// Verifies the access token in the Authorization header and attaches the
// decoded payload as request.user. @CurrentUser() / RolesGuard read
// request.user.sub (the user id) and request.user.role from here.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or malformed Authorization header");
    }

    const token = header.slice("Bearer ".length);
    try {
      (request as Request & { user?: unknown }).user = verifyAccessToken(token);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
