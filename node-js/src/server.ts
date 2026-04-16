import { createApp } from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function bootstrap() {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
