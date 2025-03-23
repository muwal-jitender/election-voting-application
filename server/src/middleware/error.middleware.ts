import { NextFunction, Request, Response } from "express";

// ✅ Custom Error Interface
interface AppError {
  statusCode: number;
  message: string;
  details?: any;
}

// ✅ Error Middleware to Catch All Errors
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("🔥 Error: ", err.message);

  let errorMessages: string[] = [];

  if (Array.isArray(err.details) && err.details.length > 0) {
    // Case: Validation errors (class-validator)
    errorMessages = err.details.map((e) => Object.values(e)[0] as string);
  } else if (err.message) {
    // Case: Custom thrown errors (e.g., "Email already exists")
    errorMessages = [err.message];
  } else {
    // Case: Unexpected errors
    errorMessages = ["Something went wrong"];
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    errorMessages,
  });
};
