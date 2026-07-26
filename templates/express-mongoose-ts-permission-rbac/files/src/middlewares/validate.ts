import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";

// Validates req.body against a Zod schema, replacing it with the parsed
// (and defaulted/coerced) value on success.
export const validateWith = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    apiResponse.error(res, message, StatusCodes.BAD_REQUEST, "VALIDATION_ERROR");
    return;
  }
  req.body = result.data;
  next();
};
