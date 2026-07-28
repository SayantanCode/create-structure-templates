import { HttpException, HttpStatus } from "@nestjs/common";

// Extends HttpException so it plays nicely with anything that already
// understands Nest exceptions, but always carries a `code` alongside the
// message so the error envelope's shape stays consistent everywhere.
export class ApiError extends HttpException {
  readonly code: string;

  constructor(status: HttpStatus, message: string, code = "ERROR") {
    super(message, status);
    this.code = code;
  }

  static badRequest(message: string, code = "BAD_REQUEST") {
    return new ApiError(HttpStatus.BAD_REQUEST, message, code);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new ApiError(HttpStatus.UNAUTHORIZED, message, code);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new ApiError(HttpStatus.FORBIDDEN, message, code);
  }

  static notFound(message = "Not found", code = "NOT_FOUND") {
    return new ApiError(HttpStatus.NOT_FOUND, message, code);
  }

  static conflict(message: string, code = "CONFLICT") {
    return new ApiError(HttpStatus.CONFLICT, message, code);
  }
}
