import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";
import * as authService from "../services/auth.service.js";

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/v1/auth",
};

export async function register(request, reply) {
  const { user, accessToken, refreshToken } = await authService.register(request.body);
  reply.setCookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  apiResponse.success(reply, { user, accessToken }, StatusCodes.CREATED);
}

export async function login(request, reply) {
  const { user, accessToken, refreshToken } = await authService.login(request.body);
  reply.setCookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  apiResponse.success(reply, { user, accessToken });
}

export async function refresh(request, reply) {
  const token = request.cookies?.[REFRESH_COOKIE];
  const { accessToken, refreshToken } = await authService.refresh(token);
  reply.setCookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  apiResponse.success(reply, { accessToken });
}

// Stateless JWTs can't be revoked before they expire without a server-side
// blocklist. This clears the refresh cookie so the browser stops sending it;
// pair with short-lived access tokens if you need a hard-revoke story.
export async function logout(_request, reply) {
  reply.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_OPTIONS.path });
  apiResponse.success(reply, { loggedOut: true });
}

export async function me(request, reply) {
  const user = await authService.me(request.user.sub);
  apiResponse.success(reply, user);
}
