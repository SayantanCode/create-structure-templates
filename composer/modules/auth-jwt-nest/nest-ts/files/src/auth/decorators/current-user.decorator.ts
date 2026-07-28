import { createParamDecorator, ExecutionContext } from "@nestjs/common";

interface RequestUser {
  sub: string;
  role: string;
}

// Reads the decoded access-token payload JwtAuthGuard attached to the
// request. Usage: @CurrentUser() user or @CurrentUser("sub") userId.
export const CurrentUser = createParamDecorator((field: keyof RequestUser | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as RequestUser;
  return field ? user?.[field] : user;
});
