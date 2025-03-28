import { ForbiddenError, UnauthorizedError } from "utils/exceptions.utils";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to allow only admins to access certain routes.
 */
export const isAdmin = (req: Request, _: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized. Please log in.");
  }

  if (!req.user.isAdmin) {
    throw new ForbiddenError("Access denied. Admins only.");
  }

  next(); // ✅ User is an admin, proceed to the next middleware or controller
};
