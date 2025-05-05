import { NextFunction, Request, Response } from "express";

import { AccessTokenPayload } from "utils/extend-express-request.utils";
import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import { jwtService } from "utils/jwt-service.utils";
import logger from "logger"; // ✅ Winston logger

/**
 * ✅ Middleware to authenticate incoming requests using JWT (from HTTP-only cookie)
 */
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[jwtService.accessTokenName] as string;

    if (!token) {
      logger.warn("🔐 Unauthorized request: No token found");
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Access Denied: No access-token provided.",
        errorType: "ACCESS_TOKEN_EXPIRED",
      });
      return;
    }

    const decoded = jwtService.verify<AccessTokenPayload>(
      token,
      env.JWT_ACCESS_SECRET
    );

    req.user = decoded;
    logger.info(`🔓 Authenticated user ➜ ${decoded.email}`);
    next();
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};
