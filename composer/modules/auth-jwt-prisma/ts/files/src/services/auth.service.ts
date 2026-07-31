import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Prisma returns plain rows with every scalar field, including the hash —
// unlike Mongoose's schema-level `select: false` + toJSON transform, there's
// no equivalent at the schema layer, so stripping the password is explicit
// here instead.
function toSafeUser(user: SafeUser & { password: string }): SafeUser {
  const { id, name, email, role, createdAt, updatedAt } = user;
  return { id, name, email, role, createdAt, updatedAt };
}

function issueTokens(user: { id: string; role: string }) {
  const identity = { id: user.id, role: user.role as "user" | "admin" };
  return {
    accessToken: signAccessToken(identity),
    refreshToken: signRefreshToken(identity),
  };
}

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ApiError.conflict("Email already in use");

  // No pre-save hook to hash this automatically the way Mongoose has one —
  // Prisma has no schema-level middleware, so it happens here instead.
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  return { user: toSafeUser(user), ...issueTokens(user) };
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  return { user: toSafeUser(user), ...issueTokens(user) };
}

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) throw ApiError.unauthorized("Missing refresh token");

  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw ApiError.unauthorized("User no longer exists");

  return issueTokens(user);
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");
  return toSafeUser(user);
}
