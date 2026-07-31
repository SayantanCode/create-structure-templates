import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler — every error, whether a known ApiError or an
// unexpected one, goes through here and comes out as the same
// { success: false, error: { message, code } } envelope.
export function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return apiResponse.error(res, err.message, err.statusCode, err.code);
  }

  // Unexpected error: never leak internals to the client, but log the
  // real stack server-side — req.log (from pino-http) ties this to the
  // same request id the access log line for this request already has.
  req.log.error(err);
  apiResponse.error(
    res,
    "Internal server error",
    StatusCodes.INTERNAL_SERVER_ERROR,
    "INTERNAL_ERROR"
  );
}
