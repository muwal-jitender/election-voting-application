import { NextFunction, Request, Response } from "express";

import { AppError } from "utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";
import logger from "logger"; // ✅ Winston logger

/**
 * ✅ Middleware to allow only admins to access certain routes.
 */
export const isAdmin = (req: Request, _: Response, next: NextFunction) => {
  if (!req.user) {
    logger.warn("🔐 Unauthorized access attempt (no user in request)");
    throw new AppError(
      "Unauthorized. Please log in.",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (!req.user.isAdmin) {
    logger.warn(`⛔ Access denied for user (${req.user.email}) - Not an admin`);
    throw new AppError("Access denied. Admins only.", StatusCodes.FORBIDDEN);
  }

  logger.info(`✅ Admin access granted for user: ${req.user.email}`);
  next();
};
