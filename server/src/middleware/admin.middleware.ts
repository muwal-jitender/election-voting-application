import { NextFunction, Request, Response } from "express";

import { AppError } from "utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware to allow only admins to access certain routes.
 */
export const isAdmin = (req: Request, _: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(
      "Unauthorized. Please log in.",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (!req.user.isAdmin) {
    throw new AppError("Access denied. Admins only.", StatusCodes.FORBIDDEN);
  }

  next(); // ✅ User is an admin, proceed to the next middleware or controller
};
