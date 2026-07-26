import * as userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await userService.listUsers();
  apiResponse.success(res, users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  apiResponse.success(res, user);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  apiResponse.success(res, user, StatusCodes.CREATED);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  apiResponse.success(res, user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
