import { env } from "../utils/env-config.utils"; // Import environment configs
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URI);
    console.log("✅ MongoDB Connected!");
  } catch (error: unknown) {
    console.error("❌ MongoDB Connection Failed:", (error as Error).stack);
    process.exit(1);
  }
};
