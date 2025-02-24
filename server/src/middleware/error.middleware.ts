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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error: ", err.message);

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    data: err.details || null,
  });
};
