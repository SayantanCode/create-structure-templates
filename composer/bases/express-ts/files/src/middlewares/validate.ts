import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";

// Validates req.body against any schema exposing a Zod-shaped `.safeParse()`
// (works with Zod itself, or anything duck-typed to match), replacing it
// with the parsed (and defaulted/coerced) value on success.
export const validateWith = (schema: { safeParse: (data: unknown) => any }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      apiResponse.error(res, message, StatusCodes.BAD_REQUEST, "VALIDATION_ERROR");
      return;
    }
    req.body = result.data;
    next();
  };
