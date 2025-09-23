import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import { connectToDatabase } from "./config/database.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectToDatabase();
    const server = createServer(app);
    server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

start();


