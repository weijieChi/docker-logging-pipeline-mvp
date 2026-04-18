import { createApp } from "./app.js";
import { logger } from "./logger/logger.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function bootstrap() {
  const app = await createApp();

  app.listen(PORT, () => {
    logger.info(`server.start Node.js server started on port ${PORT}`, {
      service: "web",
      port: PORT,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });
}

bootstrap();
