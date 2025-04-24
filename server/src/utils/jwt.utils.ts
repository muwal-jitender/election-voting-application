import { AppError } from "./exceptions.utils";
import { CookieOptions } from "express";
import { StatusCodes } from "http-status-codes";
import type { StringValue } from "ms";
import { env } from "./env-config.utils";
import jwt from "jsonwebtoken";
import logger from "logger";

type TokenType = "AccessToken" | "RefreshToken";
export const jwtService = {
  accessTokenExpiresIn: "1d",
  refreshTokenExpiresIn: "1d",
  verify: (token: string, tokenSecret: string) => {
    jwt.verify(token, tokenSecret, (err, decoded: any) => {
      if (err || !decoded?.id) {
        logger.error("❌ Invalid or expired token during authentication", err);
        throw new AppError(
          "Invalid or expired refresh token.",
          StatusCodes.UNAUTHORIZED
        );
      }
    });
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
    const day = tokenType === "AccessToken" ? 1 : 7; // 1 day or 7 days in milliseconds
    return {
      httpOnly: true, // Protects against XSS attacks
      secure: env.NODE_ENV === "production",
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: day * 24 * 60 * 60 * 1000, // Max age in milliseconds
    } as CookieOptions;
  },
};
