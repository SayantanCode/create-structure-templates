const { StatusCodes } = require("http-status-codes");

// Every response in this API follows the same envelope:
//   success: { success: true, data }
//   error:   { success: false, error: { message, code } }
const apiResponse = {
  success: (res, data, status = StatusCodes.OK) => {
    res.status(status).json({ success: true, data });
  },
  error: (res, message, status = StatusCodes.INTERNAL_SERVER_ERROR, code = "ERROR") => {
    res.status(status).json({ success: false, error: { message, code } });
  },
};

module.exports = { apiResponse };
