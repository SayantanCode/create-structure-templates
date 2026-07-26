import { apiResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";

// Validates req.body against a Zod schema, replacing it with the parsed
// (and defaulted/coerced) value on success.
export const validateWith = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return apiResponse.error(res, message, StatusCodes.BAD_REQUEST, "VALIDATION_ERROR");
  }
  req.body = result.data;
  next();
};
