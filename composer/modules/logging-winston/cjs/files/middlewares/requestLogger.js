const { randomUUID } = require("node:crypto");
const { logger } = require("../utils/logger.js");

// Winston's equivalent of pino-http: attaches a small request-scoped
// req.log (tagged with a generated request id) that other middleware and
// route handlers can log through, and logs one line once the response
// finishes (method, path, status, duration) instead of morgan's plain
// unstructured line-per-request text.
function requestLogger(req, res, next) {
  const reqId = randomUUID();
  const start = process.hrtime.bigint();

  req.log = {
    info: (message) => logger.info(message, { reqId }),
    error: (err) => logger.error({ err }, err instanceof Error ? err.message : String(err)),
  };

  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`, { reqId });
  });

  next();
}

module.exports = { requestLogger };
