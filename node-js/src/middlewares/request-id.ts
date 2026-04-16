import { v7 as uuidv7 } from "uuid";
import type { Request, Response, NextFunction } from "express";

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 生成 UUID v7 作為 requestId
  req.requestId = uuidv7();
  next();
}
