import { logger } from "../logger/logger.js";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = err instanceof Error ? err : new Error("Unknown error");

  // structured logging
  logger.error({
    requestId: req.requestId, // 從 requestId middleware 中獲取 requestId
    method: req.method,
    path: req.originalUrl,
    message: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.requestId, // 回傳給 client（可追蹤）
  });
}
