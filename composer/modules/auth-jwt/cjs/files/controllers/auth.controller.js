const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { apiResponse } = require("../utils/apiResponse.js");
const authService = require("../services/auth.service.js");

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/v1/auth",
};

const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  apiResponse.success(res, { user, accessToken }, StatusCodes.CREATED);
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  apiResponse.success(res, { user, accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies && req.cookies[REFRESH_COOKIE];
  const { accessToken, refreshToken } = await authService.refresh(token);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  apiResponse.success(res, { accessToken });
});

// Stateless JWTs can't be revoked before they expire without a server-side
// blocklist. This clears the refresh cookie so the browser stops sending it;
// pair with short-lived access tokens if you need a hard-revoke story.
const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_OPTIONS.path });
  apiResponse.success(res, { loggedOut: true });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user.sub);
  apiResponse.success(res, user);
});

module.exports = { register, login, refresh, logout, me };
