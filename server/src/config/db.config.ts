import { env } from "utils/env-config.utils"; // Import environment configs
import logger from "logger";
import mongoose from "mongoose";

// ✅ MongoDB Connection Options for Stability
const mongoOptions = {
  autoIndex: true, // ✅ Automatically build indexes, however disable on production
  connectTimeoutMS: 10000, // ✅ Give up initial connection after 10s
  socketTimeoutMS: 45000, // ✅ Close sockets after 45s of inactivity
};

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URI, mongoOptions);
    logger.info("✅ MongoDB Connected!");
  } catch (error: unknown) {
    logger.error("❌ MongoDB Connection Failed:", (error as Error).stack);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB Disconnected! Retrying...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  logger.error("❌ MongoDB Error:", err);
});
