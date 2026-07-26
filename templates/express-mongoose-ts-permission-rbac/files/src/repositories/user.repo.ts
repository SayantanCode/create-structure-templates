import { FilterQuery } from "mongoose";
import { User, UserDocument } from "../models/user.model.js";

// A simple repository pattern for Mongoose models.
// It provides a thin, generic layer for CRUD operations.
export const userRepository = {
  findById: (id: string) => User.findById(id).lean(),
  find: (query: FilterQuery<UserDocument> = {}) => User.find(query).lean(),
  create: (payload: Partial<UserDocument>) => User.create(payload),
  update: (id: string, payload: Partial<UserDocument>) =>
    User.findByIdAndUpdate(id, payload, { new: true }).lean(),
  delete: (id: string) => User.findByIdAndDelete(id).lean(),
};
