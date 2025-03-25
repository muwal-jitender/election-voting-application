import { ForbiddenError, UnauthorizedError } from "utils/exceptions.utils";
import { NextFunction, Request, Response } from "express";

import { env } from "utils/env-config.utils"; // ✅ Import environment variables
import jwt from "jsonwebtoken";

// ✅ Define a TypeScript interface for req.user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; isAdmin: boolean };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateJWT = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError("Access Denied: No token provided.");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      isAdmin: boolean;
    };
    req.user = decoded; // ✅ Attach decoded user data to the request
    next(); // ✅ Proceed to the next middleware
  } catch (error) {
    throw new ForbiddenError("Invalid or Expired Token.");
  }
};
