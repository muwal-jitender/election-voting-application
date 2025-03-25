import "reflect-metadata";

import * as dotenv from "dotenv";

import express, { Request, Response } from "express";

import { configureFileUpload } from "middleware/file-upload.middleware";
import { connectDB } from "config/db.config"; // ✅ Import connectDB()
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "utils/env-config.utils";
import { errorHandler } from "middleware/error.middleware";
import router from "core/base.routes";

dotenv.config();

const app = express();
const PORT = env.PORT || 5000;

// 1️⃣ CORS first — allows cookies to be accepted from frontend
app.use(
  cors({
    credentials: true, // ✅ allow sending cookies cross-origin
    origin: "http://localhost:3000",
  })
);

// 2️⃣ Then parse incoming cookies from request headers
app.use(cookieParser());

// 3️⃣ Then body parsers (if needed)

// ✅ Ensure Express Can Parse JSON & URL Encoded Requests
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form submissions

// ✅ Configure Express-fileupload Middleware
configureFileUpload(app);

// ✅ Test route
app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

// ✅ Use Routes
app.use(router);

// ✅ Error handling middleware (MUST be last)
app.use(errorHandler);
// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("⚡ Process Id: " + process.pid);
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
