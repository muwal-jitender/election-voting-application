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
  try {
    const refreshToken = req.cookies[jwtService.refreshTokenName];
    if (!refreshToken) {
      logger.warn("🔐 Unauthorized request: No refresh-token found.");
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized request: No refresh-token found.",
      });
      return;
    }

    const decoded = jwtService.verify<RefreshTokenPayload>(
      refreshToken,
      env.JWT_REFRESH_SECRET
    );
    const meta = jwtService.extractRequestMeta(req);
    const authService = resolve(AuthService);
    const result = await authService.validateRefreshToken(decoded, meta);

    if (!result.success) {
      logger.warn(`❌ Refresh token validation failed ➔ ${result.message}`);
      res.status(result.code).json({ message: result.message });
      return;
    }

    req.refreshTokenPayload = decoded;
    req.refreshToken = refreshToken;
    next();
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};
