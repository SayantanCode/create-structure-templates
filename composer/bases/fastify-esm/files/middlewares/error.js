import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(request, reply) {
  apiResponse.error(
    reply,
    `Route not found: ${request.method} ${request.url}`,
    StatusCodes.NOT_FOUND,
    "NOT_FOUND"
  );
}

// Centralized error handler — every error, whether a known ApiError (thrown
// from any route handler or preHandler hook — Fastify routes rejections
// here automatically, no asyncHandler wrapper needed) or an unexpected one,
// comes out as the same { success: false, error: { message, code } } envelope.
export function errorHandler(error, request, reply) {
  if (error instanceof ApiError) {
    return apiResponse.error(reply, error.message, error.statusCode, error.code);
  }

  // Some plugins (Fastify's own validation errors, @fastify/rate-limit, ...)
  // throw a plain Error that still carries a real HTTP statusCode rather
  // than an ApiError — trust it instead of collapsing every one of them
  // into a generic 500.
  if (typeof error.statusCode === "number" && error.statusCode >= 400 && error.statusCode < 500) {
    return apiResponse.error(reply, error.message, error.statusCode, error.code ?? "ERROR");
  }

  request.log.error(error);
  apiResponse.error(reply, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR");
}
