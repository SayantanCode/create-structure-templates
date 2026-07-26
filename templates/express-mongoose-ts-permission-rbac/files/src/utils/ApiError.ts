import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string, code = "ERROR", isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string, code = "BAD_REQUEST") {
    return new ApiError(StatusCodes.BAD_REQUEST, message, code);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new ApiError(StatusCodes.UNAUTHORIZED, message, code);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new ApiError(StatusCodes.FORBIDDEN, message, code);
  }

  static notFound(message = "Not found", code = "NOT_FOUND") {
    return new ApiError(StatusCodes.NOT_FOUND, message, code);
  }

  static conflict(message: string, code = "CONFLICT") {
    return new ApiError(StatusCodes.CONFLICT, message, code);
  }
}
