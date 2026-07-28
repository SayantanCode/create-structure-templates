import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Response } from "express";
import { ApiError } from "../utils/ApiError";

// Every error, whether a known ApiError, a plain Nest HttpException (thrown
// by a guard, a pipe, or Nest's own router for unmatched routes), or an
// unexpected one, goes through here and comes out as the same
// { success: false, error: { message, code } } envelope.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApiError) {
      response
        .status(exception.getStatus())
        .json({ success: false, error: { message: exception.message, code: exception.code } });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const rawMessage =
        typeof body === "string" ? body : ((body as Record<string, unknown>).message ?? exception.message);
      const message = Array.isArray(rawMessage) ? rawMessage.join(", ") : String(rawMessage);
      response.status(status).json({ success: false, error: { message, code: HttpStatus[status] } });
      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}
