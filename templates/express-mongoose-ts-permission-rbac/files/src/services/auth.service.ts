import { User, UserDocument } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

function issueTokens(user: UserDocument) {
  const identity = { id: String(user._id), role: user.role };
  return {
    accessToken: signAccessToken(identity),
    refreshToken: signRefreshToken(identity),
  };
}

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already in use");

  const user = await User.create({ name, email, password });
  return { user: user.toJSON(), ...issueTokens(user) };
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  return { user: user.toJSON(), ...issueTokens(user) };
}

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) throw ApiError.unauthorized("Missing refresh token");

  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized("User no longer exists");

  return issueTokens(user);
}

export async function me(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user.toJSON();
}
