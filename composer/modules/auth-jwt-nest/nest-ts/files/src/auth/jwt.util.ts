import * as jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set (see .env.example).");
}

export interface JwtIdentity {
  id: string;
  role: string;
}

// Access tokens carry just enough to authorize a request without a DB
// round-trip; refresh tokens are opaque-ish and only ever exchanged for a
// new access token via /auth/refresh.
export function signAccessToken(user: JwtIdentity): string {
  return jwt.sign({ sub: user.id, role: user.role }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function signRefreshToken(user: JwtIdentity): string {
  return jwt.sign({ sub: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { sub: string; role: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string };
}
