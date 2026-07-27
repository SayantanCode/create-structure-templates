import { StatusCodes } from "http-status-codes";

// Every response in this API follows the same envelope:
//   success: { success: true, data }
//   error:   { success: false, error: { message, code } }
export const apiResponse = {
  success: (reply, data, status = StatusCodes.OK) => {
    reply.code(status).send({ success: true, data });
  },
  error: (reply, message, status = StatusCodes.INTERNAL_SERVER_ERROR, code = "ERROR") => {
    reply.code(status).send({ success: false, error: { message, code } });
  },
};
