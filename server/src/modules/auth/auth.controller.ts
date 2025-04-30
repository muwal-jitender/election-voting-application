// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "modules/voter/voter.dto";
import { AuthService } from "modules/auth/auth.service";

import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import logger from "logger";

import { jwtService } from "utils/jwt.utils";
import { AppError } from "utils/exceptions.utils";
import { VoterService } from "modules/voter/voter.service";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(VoterService) private voterService: VoterService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Register Voter
      const voterData: RegisterVoterDTO = req.body;
      const voter = await this.authService.registerVoter(voterData);

      // ✅ Remove password before returning the new created voter
      const { password, ...safeNewVoter } = voter.toJSON();
      return res.status(StatusCodes.CREATED).json({
        message: "Voter registered successfully",
        data: safeNewVoter,
      });
    } catch (error: unknown) {
      logger.error("❌ Registration failed", { error });
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const signInDTO: SignInDTO = req.body;

      logger.info(`🔑 Login attempt initiated ➔ Email: ${signInDTO.email}`);

      // 1. Validate user credentials
      const voter = await this.authService.checkCredentials(
        signInDTO.email.toLowerCase(),
        signInDTO.password
      );
      logger.info(
        `✅ Credentials validated ➔ UserID: ${voter.id}, Email: ${voter.email}`
      );

      // 2. Generate and set access token cookie
      const accessToken = this.authService.generateAccessToken(voter);
      res.cookie(
        jwtService.accessTokenName,
        accessToken,
        jwtService.cookieOptions("AccessToken")
      );
      logger.info(`🔐 Access token issued ➔ UserID: ${voter.id}`);

      // 3. Capture IP and User-Agent for security tracking

      const { ipAddress, userAgent } = jwtService.extractRequestMeta(req);

      // 4. Save refresh token placeholder to DB to get _id
      const dbRefreshToken = await this.authService.saveRefreshToken({
        userId: voter.id,
        refreshToken: "placeholder", // Will update after generating token
        ipAddress,
        userAgent,
        isRevoked: false,
        expiresAt: jwtService.getRefreshTokenExpiryDate(),
        issuedAt: new Date(),
      });
      logger.info(
        `💾 Refresh token placeholder saved ➔ TokenID: ${dbRefreshToken.id}`
      );

      // 5. Generate refresh token using DB token ID
      const refreshToken = this.authService.generateRefreshToken(
        dbRefreshToken.id,
        voter.id,
        voter.email,
        ipAddress,
        userAgent
      );

      // 6. Update the DB with the actual refresh token
      dbRefreshToken.refreshToken = refreshToken;
      await dbRefreshToken.save();
      logger.info(
        `🔁 Refresh token finalized and saved ➔ TokenID: ${dbRefreshToken.id}`
      );

      // 7. Set refresh token cookie
      res.cookie(
        jwtService.refreshTokenName,
        refreshToken,
        jwtService.cookieOptions("RefreshToken")
      );
      logger.info(`🍪 Refresh token cookie set ➔ UserID: ${voter.id}`);

      // 8. Respond with user data (No token in response body for security)
      return res.status(StatusCodes.OK).json({
        message: "You are now logged in",
        data: {
          email: voter.email,
          fullName: voter.fullName,
          isAdmin: voter.isAdmin,
        },
      });
    } catch (error: unknown) {
      logger.error(`❌ Login failed ➔ Email: ${req.body?.email}`, { error });
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Clear access and refresh cookies
      res.clearCookie(jwtService.accessTokenName, {
        ...jwtService.cookieOptions("AccessToken"),
        maxAge: 0,
      });

      res.clearCookie(jwtService.refreshTokenName, {
        ...jwtService.cookieOptions("RefreshToken"),
        maxAge: 0,
      });

      // 2. Revoke refresh token in DB (if exists)
      const refreshToken = req.refreshTokenPayload;
      if (refreshToken?.id) {
        await this.authService.update(refreshToken.id);
        logger.info(`🚪 Logout: Revoked refresh token ➔ ${refreshToken.id}`);
      } else {
        logger.warn(
          "⚠️ Logout attempted without valid refresh token in request"
        );
      }

      // 3. Return success response
      res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("❌ Logout failed", { error });
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.refreshTokenPayload as RefreshTokenPayload;

      // (Optional) Verify if refresh token is still valid in DB
      // const storedToken = await tokenService.findValidRefreshToken(decoded.userId, refreshToken);
      // if (!storedToken) return res.status(401).json({ message: "Token no longer valid." });
      const { ipAddress, userAgent } = jwtService.extractRequestMeta(req);
      const refreshTokenPayload: RefreshTokenPayload = {
        ...refreshToken,
        ipAddress,
        userAgent,
      };
      const dbRefreshToken = await this.authService.findRefreshToken(
        refreshTokenPayload,
        req.refreshToken as string
      );
      if (!dbRefreshToken) {
        throw new AppError(
          "Refresh no longer exists.",
          StatusCodes.UNAUTHORIZED
        );
      }
      const user = await this.voterService.getVoterById(refreshToken.userId);
      if (!user) {
        throw new AppError("User no longer exists.", StatusCodes.UNAUTHORIZED);
      }

      // Generate new tokens
      const newAccessToken = jwtService.signin(
        { userId: user.id, isAdmin: user.isAdmin },
        env.JWT_ACCESS_SECRET,
        "AccessToken"
      );

      const newRefreshToken = jwtService.signin(
        { userId: user.id },
        env.JWT_REFRESH_SECRET,
        "RefreshToken"
      );

      // (Optional) Replace old refresh token in DB
      // await tokenService.updateRefreshToken(user.id, newRefreshToken);
      await this.authService.update(refreshToken.id);
      logger.info(
        `🚪 Refresh Token: Revoked refresh token ➔ ${refreshToken.id}`
      );
      // Set new cookies
      res.cookie(
        "access_token",
        newAccessToken,
        jwtService.cookieOptions("AccessToken")
      );

      res.cookie(
        "refresh_token",
        newRefreshToken,
        jwtService.cookieOptions("RefreshToken")
      );

      return res
        .status(StatusCodes.OK)
        .json({ message: "Token refreshed successfully." });
    } catch (error) {
      logger.error("⚠️ Error refreshing token", { error });
      next(error);
    }
  }
}
