import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function listUsers() {
  return User.find().lean();
}

export async function getUserById(id: string) {
  const doc = await User.findById(id).lean();
  if (!doc) throw ApiError.notFound("User not found");
  return doc;
}

export async function createUser(payload: { name: string; email: string; password: string; role?: "user" | "admin" }) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw ApiError.conflict("Email already in use");
  const doc = await User.create(payload);
  return doc.toObject();
}

export async function updateUser(id: string, payload: Partial<{ name: string; email: string; role: "user" | "admin" }>) {
  const doc = await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  if (!doc) throw ApiError.notFound("User not found");
  return doc;
}

export async function deleteUser(id: string) {
  const res = await User.findByIdAndDelete(id);
  if (!res) throw ApiError.notFound("User not found");
  return true;
}
