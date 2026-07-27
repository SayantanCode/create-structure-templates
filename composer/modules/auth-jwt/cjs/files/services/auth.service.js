const { User } = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt.js");

function issueTokens(user) {
  const identity = { id: user._id.toString(), role: user.role };
  return {
    accessToken: signAccessToken(identity),
    refreshToken: signRefreshToken(identity),
  };
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already in use");

  const user = await User.create({ name, email, password });
  return { user: user.toJSON(), ...issueTokens(user) };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  return { user: user.toJSON(), ...issueTokens(user) };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw ApiError.unauthorized("Missing refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized("User no longer exists");

  return issueTokens(user);
}

async function me(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user.toJSON();
}

module.exports = { register, login, refresh, me };
