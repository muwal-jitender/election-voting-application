import { ForbiddenError, UnauthorizedError } from "../utils/exceptions.utils";
import { NextFunction, Request, Response } from "express";

import { env } from "../utils/env-config.utils"; // ✅ Import environment variables
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
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedError("No token provided.");
  }

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    throw new UnauthorizedError("Invalid token format.");
  }
  const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token from "Bearer <token>"

  if (!token) {
    throw new UnauthorizedError("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      isAdmin: boolean;
    };
    req.user = decoded; // ✅ Attach decoded user data to request
    next(); // ✅ Proceed to the next middleware
  } catch (error) {
    throw new ForbiddenError("Invalid or Expired Token.");
  }
};
