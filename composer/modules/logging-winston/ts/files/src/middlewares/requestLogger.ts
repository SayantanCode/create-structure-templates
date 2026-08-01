import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

interface RequestLog {
  info: (message: string) => void;
  error: (err: unknown) => void;
}

declare global {
  namespace Express {
    interface Request {
      log: RequestLog;
    }
  }
}

// Winston's equivalent of pino-http: attaches a small request-scoped
// req.log (tagged with a generated request id) that other middleware and
// route handlers can log through, and logs one line once the response
// finishes (method, path, status, duration) instead of morgan's plain
// unstructured line-per-request text.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const reqId = randomUUID();
  const start = process.hrtime.bigint();

  req.log = {
    info: (message) => logger.info({ reqId }, message),
    error: (err) => logger.error({ err }, err instanceof Error ? err.message : String(err)),
  };

  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info({ reqId }, `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });

  next();
}
