import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const env = {
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:5000",
};
