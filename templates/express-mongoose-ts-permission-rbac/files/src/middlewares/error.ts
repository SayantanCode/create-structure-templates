import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler — every error, whether a known ApiError or an
// unexpected one, goes through here and comes out as the same
// { success: false, error: { message, code } } envelope.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    apiResponse.error(res, err.message, err.statusCode, err.code);
    return;
  }

  // Unexpected error: never leak internals to the client, but log the
  // real stack server-side.
  console.error(err);
  apiResponse.error(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR");
}
