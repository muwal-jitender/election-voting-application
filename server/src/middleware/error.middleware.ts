import { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import logger from "logger"; // ✅ Winston logger

// ✅ Extended Error Interface
interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

// ✅ Global Error Handler Middleware
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const isProduction = process.env.NODE_ENV === "production";

  let errorMessages: string[] = [];

  if (Array.isArray(err.details) && err.details.length > 0) {
    // Handle validation errors
    errorMessages = err.details.map((e) => Object.values(e)[0] as string);
  } else if (err.message) {
    errorMessages = [err.message];
  } else {
    errorMessages = ["Something went wrong"];
  }

  // ✅ Log the error with Winston
  logger.error(`❌ Error: ${err.message}`, {
    stack: err.stack,
    details: err.details || null,
    statusCode,
  });

  // ✅ Send response to client
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    errorMessages,
    ...(isProduction ? {} : { stack: err.stack }), // Show stack trace only in dev
  });
};
