import { NextFunction, Request, Response } from "express";

import { AppError } from "utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";
import { TokenPayload } from "utils/extend-express-request.utils";
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
  const token = req.cookies.access_token;

  if (!token) {
    logger.warn("🔐 Unauthorized request: No token found");
    throw new AppError(
      "Access Denied: No token provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const decoded = jwtService.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as TokenPayload;

  req.user = decoded;
  logger.info(`🔓 Authenticated user ➜ ${decoded.email}`);
  next();
};
