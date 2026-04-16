import express from 'express';
import { morganMiddleware } from './middlewares/morgan.js';

export function createApp() {
  const app = express();

  app.use(morganMiddleware);

  app.get("/", (req, res) => {
    res.json({ message: "ok" });
  });

  return app; 
}