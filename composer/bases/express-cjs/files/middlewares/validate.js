const { StatusCodes } = require("http-status-codes");
const { apiResponse } = require("../utils/apiResponse.js");

// Validates req.body against any schema exposing a Zod-shaped `.safeParse()`
// (works with Zod itself, or anything duck-typed to match), replacing it
// with the parsed (and defaulted/coerced) value on success.
const validateWith = (schema) => (req, res, next) => {
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

module.exports = { validateWith };
