import "reflect-metadata";

import * as dotenv from "dotenv";

import express, { Request, Response } from "express";

import { configureFileUpload } from "./middleware/file-upload.middleware";
import { connect } from "mongoose";
import cors from "cors";
import { env } from "./utils/env-config.utils";
import { errorHandler } from "./middleware/error.middleware";
import router from "./routes/index";

dotenv.config();

const app = express();
const PORT = env.PORT || 5000;
const DB = (env.DB_URI as string) || "";

// ✅ Enable CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// ✅ Ensure Express Can Parse JSON & URL Encoded Requests
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form submissions

// ✅ Configure Express-fileupload Middleware
configureFileUpload(app);

// ✅ Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

// ✅ Use Routes
app.use(router);

// ✅ Error handling middleware (MUST be last)
app.use(errorHandler);
// Start server
connect(DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log("⚡ Process Id: " + process.pid);
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
