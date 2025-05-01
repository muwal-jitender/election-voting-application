import { NextFunction, Request, Response } from "express";

import { AppError } from "utils/exceptions.utils";
import { AuthService } from "modules/auth/auth.service";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";
import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import { jwtService } from "utils/jwt.utils";
import logger from "logger";
import { resolve } from "utils/resolve.utils";

export const attachRefreshToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[jwtService.refreshTokenName];
  if (!refreshToken) {
    logger.warn("🔐 Unauthorized request: No refresh-token found");
    throw new AppError(
      "Refresh Denied: No refresh-token provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const decoded = jwtService.verify<RefreshTokenPayload>(
    refreshToken,
    env.JWT_REFRESH_SECRET
  );
  // 🔍 Fetch the refresh token document by ID
  const authService = resolve(AuthService);
  const tokenDoc = await authService.findById(decoded.id);
  if (!tokenDoc) {
    logger.warn("❌ Invalid or deleted refresh token");
    throw new AppError(
      "Refresh token no longer exists.",
      StatusCodes.UNAUTHORIZED
    );
  }
  // ⏰ Check if the refresh token has expired
  if (tokenDoc.expiresAt.getTime() < Date.now()) {
    logger.warn("❌ Refresh token expired");
    throw new AppError("Refresh token expired.", StatusCodes.UNAUTHORIZED);
  }
  req.refreshTokenPayload = decoded;
  req.refreshToken = refreshToken;
  next();
};
