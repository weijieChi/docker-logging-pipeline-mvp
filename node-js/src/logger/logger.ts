import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // ⭐ 支援 stack
    winston.format.json(),
  ),

  defaultMeta: {
    service: "web",
  },
  transports: [new winston.transports.Console()],
});
