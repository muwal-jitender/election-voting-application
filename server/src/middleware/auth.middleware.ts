import { NextFunction, Request, Response } from "express";

import { AppError } from "utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import jwt from "jsonwebtoken";
import logger from "logger"; // ✅ Winston logger

// ✅ Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; isAdmin: boolean };
    }
  }
}

/**
 * ✅ Middleware to authenticate incoming requests using JWT (from HTTP-only cookie)
 */
export const authenticateJWT = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    logger.warn("🔐 Unauthorized request: No token found");
    throw new AppError(
      "Access Denied: No token provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      isAdmin: boolean;
    };

    req.user = decoded;
    logger.info(`🔓 Authenticated user ➜ ${decoded.email}`);
    next();
  } catch (error) {
    logger.error("❌ Invalid or expired token during authentication", error);
    throw new AppError("Invalid or Expired Token.", StatusCodes.FORBIDDEN);
  }
};
