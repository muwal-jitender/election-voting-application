import type { StringValue } from "ms";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const env = {
  // JWT Access token configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_secret_key",
  JWT_ACCESS_EXPIRES_IN: (process.env.JWT_ACCESS_EXPIRES_IN ||
    "10Minutes") as StringValue,

  // JWT Refresh token configuration
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret_key",
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "7Days") as StringValue,

  // Database Configuration
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/election-voting-app",
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
