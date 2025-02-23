import "reflect-metadata";

import * as dotenv from "dotenv";

import express, { Request, Response } from "express";

import { connect } from "mongoose";
import cors from "cors";
import { env } from "./utils/env.config";
import router from "./routes/index";
import upload from "express-fileupload";

dotenv.config();

const app = express();
const PORT = env.PORT || 5000;
const DB = (process.env.MONGO_URI as string) || "";

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

app.use(upload());
app.use(router);

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
