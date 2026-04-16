import morgan from "morgan";
import { logger } from "../logger/logger.js";
import type { Request, Response } from "express";


export const morganMiddleware = morgan(
  (tokens, req: Request, res: Response) => {
    return JSON.stringify({
      level: "info",
      message: "HTTP request",
      method: tokens.method?.(req, res),
      path: tokens.url?.(req, res),
      statusCode: Number(tokens.status?.(req, res)),
      latency: Number(tokens["response-time"]?.(req, res)),
      requestId: req.requestId, // 從 requestId middleware 中獲取 requestId
    })
  },
  {
    stream: {
      write: (message) => {
        logger.info(JSON.parse(message));
      },
    },
  },
);
