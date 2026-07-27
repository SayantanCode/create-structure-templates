import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";

// Returns a Fastify preHandler that validates request.body against any
// schema exposing a Zod-shaped `.safeParse()`, replacing it with the parsed
// (and defaulted/coerced) value on success.
export const validateWith = (schema) => async (request, reply) => {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return apiResponse.error(reply, message, StatusCodes.BAD_REQUEST, "VALIDATION_ERROR");
  }
  request.body = result.data;
};
