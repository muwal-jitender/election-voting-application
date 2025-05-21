import type { StringValue } from "ms";
import dotenv from "dotenv";
import { validateEnv } from "./validate-env.utils";

dotenv.config(); // Load environment variables
validateEnv(process.env); // Validate required environment variables

export const env = {
  // JWT Access token configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: (process.env.JWT_ACCESS_EXPIRES_IN ||
    "10Minutes") as StringValue,

  // JWT Refresh token configuration
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "7Days") as StringValue,

  // Database Configuration
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  CURRENT_TOKEN_VERSION: Number(process.env.CURRENT_TOKEN_VERSION || 1),
  TOTP_SECRET_KEY: process.env.TOTP_SECRET_KEY, // Base32 encoded secret key
};
