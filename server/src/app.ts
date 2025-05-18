import "reflect-metadata";

import * as dotenv from "dotenv";

import express, { Request, Response } from "express";

import { configureFileUpload } from "middleware/file-upload.middleware";
import { connectDB } from "config/db.config"; // ✅ Import connectDB()
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "utils/env-config.utils";
import { errorHandler } from "middleware/error.middleware";
import { requestLogger } from "middleware/logger.middleware";
import router from "core/base.routes";
import securityHeaders from "middleware/security-headers.middleware";

dotenv.config();

const app = express();
app.use(securityHeaders); // ✅ Security headers middleware
app.use(requestLogger); // ✅ All incoming requests logged to Winston
// 🔒 Hide tech stack from headers
app.disable("x-powered-by");
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

/**
 * Only trust X-Forwarded-For headers if the request comes from these IPs
 * Useful when your app is behind a reverse proxy (like Nginx or AWS ELB).
 * Ignore forwarded headers from any other untrusted sources.
 */
app.set("trust proxy", ["127.0.0.1", "10.0.0.1"]);

// ✅ Configure Express-fileupload Middleware
configureFileUpload(app);

// ✅ Test route
app.get("/", (_req: Request, res: Response) => {
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
