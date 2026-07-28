import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { registerSchema, loginSchema, RegisterDto, LoginDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/v1/auth",
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST defaults to a 201 response in Nest, matching the register/login
  // split used across every other framework target in this generator.
  @Post("register")
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.register(body);
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
    return { user, accessToken };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(body);
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
    return { user, accessToken };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE];
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
    return { accessToken };
  }

  // Stateless JWTs can't be revoked before they expire without a server-side
  // blocklist. This clears the refresh cookie so the browser stops sending it;
  // pair with short-lived access tokens if you need a hard-revoke story.
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_OPTIONS.path });
    return { loggedOut: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser("sub") userId: string) {
    return this.authService.me(userId);
  }
}
