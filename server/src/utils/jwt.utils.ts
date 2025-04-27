import { AccessTokenPayload } from "./extend-express-request.utils";
import { AppError } from "./exceptions.utils";
import { CookieOptions } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "./env-config.utils";
import jwt from "jsonwebtoken";
import logger from "logger";
import { parseDurationToMs } from "./duration-parser.utils";

type TokenType = "AccessToken" | "RefreshToken";
export const jwtService = {
  accessTokenName: "access_token",
  refreshTokenName: "refresh_token",
  verify: (token: string, tokenSecret: string) => {
    const decoded = jwt.verify(token, tokenSecret) as AccessTokenPayload;
    if (!decoded) {
      logger.error("❌ Invalid token", { token });
      throw new AppError(
        "Invalid or expired refresh token.",
        StatusCodes.UNAUTHORIZED
      );
    }
    return decoded;
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
  /**
   * The date to be saved in the database for the refresh-token expiry date.
   * @returns
   */
  getRefreshTokenExpiryDate: () => {
    return new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN));
  },
};
