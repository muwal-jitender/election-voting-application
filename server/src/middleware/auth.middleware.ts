import { NextFunction, Request, Response } from "express";

import { AccessTokenPayload } from "utils/extend-express-request.utils";
import { AppError } from "utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import { jwtService } from "utils/jwt.utils";
import logger from "logger"; // ✅ Winston logger

/**
 * ✅ Middleware to authenticate incoming requests using JWT (from HTTP-only cookie)
 */
export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies[jwtService.accessTokenName];

  if (!token) {
    logger.warn("🔐 Unauthorized request: No token found");
    throw new AppError(
      "Access Denied: No access-token provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const decoded = jwtService.verify<AccessTokenPayload>(
    token,
    env.JWT_ACCESS_SECRET
  );

  req.user = decoded;
  logger.info(`🔓 Authenticated user ➜ ${decoded.email}`);
  next();
};
