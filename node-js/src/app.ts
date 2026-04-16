import express from "express";
import { morganMiddleware } from "./middlewares/morgan.js";
import { requestIdMiddleware } from "./middlewares/request-id.js";

import type { Request, Response } from "express";

export async function createApp() {
  const app = express();

  // ===== Middlewares =====
  app.use(requestIdMiddleware); // request ID middleware ，必須放在 morgan 之後，這樣 morgan 才能在日誌中使用 requestId
  app.use(express.json());
  app.use(morganMiddleware);


  // ===== Routes =====
  app.get("/", (req, res) => {
    res.json({ message: "ok" });
  });

  app.get("/api/test", (req, res) => {
    res.json({ message: "test log" });
  });

  app.get("/app/error", (req, res) => {
    throw new Error("test error");
  });

  app.get("/api/warn", (req, res) => {
    res.status(400).json({ message: "warning example" });
  });

  app.get("/api/slow", (req, res) => {
    setTimeout(() => {
      res.json({ message: "slow response" });
    }, 500);
    res.json({ message: "slow response" });
  });

  // ===== Error Handler（很重要）=====
  app.use((err: unknown, req: Request, res: Response) => {
    console.error(err); // 之後會換成 winston
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
}
