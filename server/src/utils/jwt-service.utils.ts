import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./extend-express-request.utils";
import { CookieOptions, Response } from "express";

import { AppError } from "./exceptions.utils";
import { IRefreshTokenDocument } from "modules/auth/auth.model";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import crypto from "crypto";
import { env } from "./env-config.utils";
import jwt from "jsonwebtoken";
import logger from "logger";
import { parseDurationToMs } from "./duration-parser.utils";

type TokenType = "AccessToken" | "RefreshToken";
export type TokenValidationResult =
  | { success: true; token: IRefreshTokenDocument }
  | { success: false; code: number; message: string };
export const jwtService = {
  accessTokenName: "access_token",
  refreshTokenName: "refresh_token",
  currentTokenVersion: Number(env.CURRENT_TOKEN_VERSION),
  verify: <T extends AccessTokenPayload | RefreshTokenPayload>(
    token: string,
    tokenSecret: string
  ): T => {
    const decoded = jwt.verify(token, tokenSecret);
    if (!decoded) {
      logger.error("❌ Invalid token", { token });
      throw new AppError(
        "Invalid or expired refresh token.",
        StatusCodes.UNAUTHORIZED
      );
    }
    return decoded as T;
  },
  signin: (payload: object, tokenSecret: string, tokenType: TokenType) => {
    return jwt.sign(payload, tokenSecret, {
      expiresIn:
        tokenType === "AccessToken"
          ? env.JWT_ACCESS_EXPIRES_IN
          : env.JWT_REFRESH_EXPIRES_IN,
    });
  },
  cookieOptions: (tokenType: TokenType) => {
    const expiresIn =
      tokenType === "AccessToken"
        ? env.JWT_ACCESS_EXPIRES_IN
        : env.JWT_REFRESH_EXPIRES_IN;
    const maxAge = parseDurationToMs(expiresIn);
    return {
      httpOnly: true, // Protects against XSS attacks
      secure: env.NODE_ENV === "production",
      sameSite: "strict", // Protects against CSRF attacks
      maxAge,
    } as CookieOptions;
  },
  clearAuthCookies: (
    res: Response,
    userId?: Types.ObjectId,
    meta?: { ipAddress: string; userAgent: string }
  ) => {
    res.clearCookie(jwtService.accessTokenName, {
      ...jwtService.cookieOptions("AccessToken"),
      maxAge: 0,
    });
    res.clearCookie(jwtService.refreshTokenName, {
      ...jwtService.cookieOptions("RefreshToken"),
      maxAge: 0,
    });
    logger.info(
      userId
        ? `✅ [RevokeAll] Cookies cleared and tokens revoked ➔ UserID: ${userId}`
        : `✅ [RevokeAll] Cookies cleared and tokens revoked`
    );
    if (meta?.ipAddress) {
      logger.info(`🌐 [RevokeAll] IP Address ➔ ${meta.ipAddress}`);
    }

    if (meta?.userAgent) {
      logger.info(`🖥️ [RevokeAll] User Agent ➔ ${meta.userAgent}`);
    }
  },

  /**
   * The date to be saved in the database for the refresh-token expiry date.
   * @returns
   */
  getRefreshTokenExpiryDate: () => {
    return new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN));
  },
  extractRequestMeta: (
    req: Request
  ): {
    ipAddress: string;
    userAgent: string;
  } => {
    const ipAddress = (
      req.ip ||
      req.socket?.remoteAddress ||
      "unknown"
    ).toString();

    const userAgent =
      (req.headers["user-agent"] as string | undefined) || "unknown";
    logger.info(`🌍 IP & Device ➔ IP: ${ipAddress}, UA: ${userAgent}`);
    return {
      ipAddress,
      userAgent,
    };
  },
  hashToken: (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
