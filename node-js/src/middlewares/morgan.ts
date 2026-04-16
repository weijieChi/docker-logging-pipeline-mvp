import morgan from "morgan";
import { logger } from "../logger/logger.js";

export const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      level: "info",
      message: "HTTP request",
      method: tokens.method?.(req, res),
      path: tokens.url?.(req, res),
      statusCode: Number(tokens.status?.(req, res)),
      latency: Number(tokens["response-time"]?.(req, res)),
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
