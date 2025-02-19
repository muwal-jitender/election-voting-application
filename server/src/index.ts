import "reflect-metadata"

import * as dotenv from "dotenv";

import {errorHandler, notFound} from './middleware/error.middleware';
import express, { Request, Response } from "express";

import {connect} from "mongoose";
import cors from "cors";
import  router  from "./routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URI as string || "";


// Middleware
app.use(cors({credentials: true, origin:"http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

app.use(router);
app.use(notFound);
app.use(errorHandler);

// Start server
connect(DB).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
});