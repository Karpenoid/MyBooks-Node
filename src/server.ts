import { PORT } from "./env.js";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import { redisClient } from "./lib/redis.js";

async function startServer() {
  await redisClient.connect();
  console.log("Redis connected successfully");

  await prisma.$connect();
  console.log("Connected to the database");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from the database");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from the database");
  process.exit(0);
});

startServer();
