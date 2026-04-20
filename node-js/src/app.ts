import express from "express";
import { morganMiddleware } from "./middlewares/morgan.js";
import { requestIdMiddleware } from "./middlewares/request-id.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export async function createApp() {
  const app = express();

  // ===== Middlewares =====
  app.use(requestIdMiddleware); // request ID middleware
  app.use(express.json());
  app.use(morganMiddleware);

  // ===== Routes =====
  app.get("/", (req, res) => {
    res.json({ message: "ok" });
  });

  app.get("/api/test", (req, res) => {
    res.json({ message: "test log" });
  });

  app.get("/api/error", (req, res) => {
    throw new Error("test error");
  });

  app.get("/api/warn", (req, res) => {
    res.status(400).json({ message: "warning example" });
  });

  app.get("/api/slow", (req, res) => {
    setTimeout(() => {
      res.json({ message: "slow response" });
    }, 500);
  });

  // error handler
  app.use(errorHandler);

  return app;
}
