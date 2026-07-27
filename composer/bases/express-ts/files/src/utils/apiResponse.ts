import { Response } from "express";
import { StatusCodes } from "http-status-codes";

// Every response in this API follows the same envelope:
//   success: { success: true, data }
//   error:   { success: false, error: { message, code } }
export const apiResponse = {
  success: (res: Response, data: unknown, status: number = StatusCodes.OK) => {
    res.status(status).json({ success: true, data });
  },
  error: (
    res: Response,
    message: string,
    status: number = StatusCodes.INTERNAL_SERVER_ERROR,
    code = "ERROR"
  ) => {
    res.status(status).json({ success: false, error: { message, code } });
  },
};
