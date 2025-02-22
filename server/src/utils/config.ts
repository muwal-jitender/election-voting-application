import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || "default_secret_key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/election-voting-app",
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};
