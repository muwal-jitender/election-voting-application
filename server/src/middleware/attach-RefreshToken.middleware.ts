import { NextFunction, Request, Response } from "express";

import { AuthService } from "modules/auth/auth.service";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";
import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import { jwtService } from "utils/jwt-service.utils";
import logger from "logger";
import { resolve } from "utils/resolve.utils";

export const attachRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const meta = jwtService.extractRequestMeta(req);
  const { ipAddress, userAgent } = meta;

  try {
    const refreshToken = req.cookies[jwtService.refreshTokenName];
    if (!refreshToken) {
      logger.warn(
        "🔐 No refresh-token provided ➔ IP: %s | UA: %s",
        ipAddress,
        userAgent
      );
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized request: No refresh-token cookie found.",
        errorType: "REFRESH_TOKEN_INVALID",
      });
      return;
    }

    logger.info(
      "🧪 Verifying refresh token ➔ IP: %s | UA: %s",
      ipAddress,
      userAgent
    );

    const decoded = jwtService.verify<RefreshTokenPayload>(
      refreshToken,
      env.JWT_REFRESH_SECRET
    );

    const authService = resolve(AuthService);
    const result = await authService.validateRefreshToken(
      decoded,
      refreshToken,
      res,
      meta
    );

    if (!result.success) {
      logger.warn(
        "❌ Refresh token validation failed ➔ Reason: %s | UserID: %s | IP: %s | UA: %s",
        result.message,
        decoded.userId,
        ipAddress,
        userAgent
      );

      res
        .status(result.code)
        .json({ message: result.message, errorType: "REFRESH_TOKEN_INVALID" });
      return;
    }

    logger.info(
      "✅ Refresh token validated successfully ➔ UserID: %s | TokenID: %s",
      decoded.userId,
      decoded.id
    );

    req.refreshTokenPayload = decoded;
    req.refreshToken = refreshToken;
    next();
  } catch (err) {
    logger.error(
      "🔥 Unexpected error during refresh-token verification ➔ IP: %s | UA: %s",
      ipAddress,
      userAgent,
      { err }
    );
    next(err);
  }
};
