import { NextFunction, Request, Response } from "express";

import { AppError } from "utils/exceptions.utils";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";
import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import { jwtService } from "utils/jwt.utils";
import logger from "logger";

export const attachRefreshToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[jwtService.refreshTokenName];
  if (!refreshToken) {
    logger.warn("🔐 Unauthorized request: No token found");
    throw new AppError(
      "Access Denied: No refresh-token provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const decoded = jwtService.verify<RefreshTokenPayload>(
    refreshToken,
    env.JWT_REFRESH_SECRET
  );
  req.refreshToken = decoded;

  next();
};
