import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/svaraai_tpms";
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined });
  logger.info("Connected to MongoDB");
}


