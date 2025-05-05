// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "modules/voter/voter.dto";
import { AuthService } from "modules/auth/auth.service";

import { StatusCodes } from "http-status-codes";
import { randomUUID } from "crypto";
import logger from "logger";

import { jwtService } from "utils/jwt-service.utils";
import { AppError } from "utils/exceptions.utils";
import { VoterService } from "modules/voter/voter.service";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";
import { VoterDocument } from "modules/voter/voter.model";
import { env } from "utils/env-config.utils";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(VoterService) private voterService: VoterService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const voterData: RegisterVoterDTO = req.body;

    try {
      logger.info(
        `📝 [Register] Registration attempt ➔ Email: ${voterData.email}`
      );

      // 1️⃣ Register voter in database
      const voter = await this.authService.registerVoter(voterData);
      logger.info(
        `✅ [Register] Voter created successfully ➔ ID: ${voter.id}, Email: ${voter.email}`
      );

      // 2️⃣ Remove sensitive fields before sending response
      const { password, ...safeNewVoter } = voter.toJSON();

      // 3️⃣ Respond with voter info
      return res.status(StatusCodes.CREATED).json({
        message: "Voter registered successfully",
        data: safeNewVoter,
      });
    } catch (error: unknown) {
      logger.error(`❌ [Register] Failed ➔ Email: ${voterData.email}`, {
        error,
      });
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const signInDTO: SignInDTO = req.body;
    const email = signInDTO.email.toLowerCase();

    try {
      logger.info(`🔑 [Login] Attempt started ➔ Email: ${email}`);

      // 1️⃣ Validate credentials
      const voter = await this.authService.checkCredentials(
        email,
        signInDTO.password
      );
      logger.info(
        `✅ [Login] Credentials verified ➔ UserID: ${voter.id}, Email: ${voter.email}`
      );

      // 2️⃣ Issue access and refresh tokens
      await this.generateTokens(req, res, voter);
      logger.info(
        `🔐 [Login] Tokens generated and cookies set ➔ UserID: ${voter.id}`
      );

      // 3️⃣ Respond with safe user data
      return res.status(StatusCodes.OK).json({
        message: "You are now logged in",
        data: {
          email: voter.email,
          fullName: voter.fullName,
          isAdmin: voter.isAdmin,
        },
      });
    } catch (error: unknown) {
      logger.error(`❌ [Login] Failed ➔ Email: ${email}`, { error });
      next(error);
    }
  }

  private async generateTokens(
    req: Request,
    res: Response,
    voter: VoterDocument
  ) {
    logger.info(
      `🎯 [Token Generation] Starting token issuance ➔ UserID: ${voter.id}, Email: ${voter.email}`
    );

    // 1️⃣ Generate access token
    const accessToken = this.authService.generateAccessToken(voter);
    res.cookie(
      jwtService.accessTokenName,
      accessToken,
      jwtService.cookieOptions("AccessToken")
    );
    logger.info(
      `🔐 [AccessToken] Issued and set as cookie ➔ UserID: ${voter.id}`
    );

    // 2️⃣ Capture metadata for refresh token
    const { ipAddress, userAgent } = jwtService.extractRequestMeta(req);
    logger.info(
      `📡 [Metadata] Captured IP and User-Agent ➔ IP: ${ipAddress}, UA: ${userAgent}`
    );

    // 3️⃣ Save placeholder refresh token
    const placeholderToken = randomUUID();
    const dbRefreshToken = await this.authService.saveRefreshToken({
      userId: voter.id,
      refreshToken: placeholderToken,
      ipAddress,
      userAgent,
      isRevoked: false,
      expiresAt: jwtService.getRefreshTokenExpiryDate(),
      issuedAt: new Date(),
    });
    logger.info(
      `💾 [RefreshToken] Placeholder stored ➔ TokenID: ${dbRefreshToken.id}`
    );

    // 4️⃣ Generate actual refresh token with DB ID
    const refreshToken = this.authService.generateRefreshToken(
      dbRefreshToken.id,
      voter.id,
      voter.email,
      ipAddress,
      userAgent
    );
    logger.info(`🔁 [RefreshToken] JWT generated ➔ UserID: ${voter.id}`);

    // 5️⃣ Update DB with final refresh token
    dbRefreshToken.refreshToken = jwtService.hashToken(refreshToken);
    await dbRefreshToken.save();
    logger.info(
      `✅ [RefreshToken] Final token saved ➔ TokenID: ${dbRefreshToken.id}`
    );

    // 6️⃣ Set refresh token cookie
    res.cookie(
      jwtService.refreshTokenName,
      refreshToken,
      jwtService.cookieOptions("RefreshToken")
    );
    logger.info(`🍪 [RefreshToken] Cookie set ➔ UserID: ${voter.id}`);

    logger.info(
      `🎉 [Token Generation] Completed successfully ➔ UserID: ${voter.id}`
    );
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies[jwtService.refreshTokenName];

      if (!rawRefreshToken) {
        logger.warn(
          "⚠️ [Logout] No refresh token cookie found. Proceeding to clear cookies."
        );
      } else {
        try {
          const decoded = jwtService.verify<RefreshTokenPayload>(
            rawRefreshToken,
            env.JWT_REFRESH_SECRET
          );
          await this.authService.update(decoded.id);
          logger.info(
            `🚪 [Logout] Refresh token revoked ➔ TokenID: ${decoded.id}, UserID: ${decoded.userId}`
          );
        } catch (verifyErr) {
          logger.warn(
            "⚠️ [Logout] Failed to decode refresh token during logout",
            { verifyErr }
          );
        }
        // 🧼 Always clear cookies regardless of token validity
        jwtService.clearAuthCookies(res);
      }

      // ✅ Respond to client
      res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("❌ [Logout] Logout process failed", { error });
      next(error);
    }
  }
  async logoutAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies[jwtService.refreshTokenName];

      if (!rawRefreshToken) {
        logger.warn(
          "⚠️ [Logout] No refresh token cookie found. Proceeding to clear cookies."
        );
      } else {
        try {
          const decoded = jwtService.verify<RefreshTokenPayload>(
            rawRefreshToken,
            env.JWT_REFRESH_SECRET
          );
          await this.authService.revokeAllTokensByUserId(decoded.id);
          logger.info(
            `🚪 [Logout] Refresh token revoked ➔ TokenID: ${decoded.id}, UserID: ${decoded.userId}`
          );
          logger.info("🧹 [Logout] Access and refresh cookies cleared.");
        } catch (verifyErr) {
          logger.warn(
            "⚠️ [Logout] Failed to decode refresh token during logout",
            { verifyErr }
          );
        }
        // 🧼 Always clear cookies regardless of token validity
        jwtService.clearAuthCookies(res);
      }

      // ✅ Respond to client
      res
        .status(StatusCodes.OK)
        .json({ message: "Logged out from all devices successfully" });
    } catch (error) {
      logger.error("❌ [LogoutAll] Logout from all devices failed", { error });
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.refreshTokenPayload as RefreshTokenPayload;
      const tokenId = refreshToken?.id?.toString() || "unknown";

      logger.info(
        `🔄 [RefreshToken] Attempt ➔ TokenID: ${tokenId}, UserID: ${refreshToken.userId}`
      );

      const user = await this.voterService.getVoterById(refreshToken.userId);
      if (!user) {
        logger.warn(
          `❌ [RefreshToken] User not found ➔ UserID: ${refreshToken.userId}`
        );
        throw new AppError("User no longer exists.", StatusCodes.UNAUTHORIZED);
      }

      logger.info(`✅ [RefreshToken] User validated ➔ ${user.email}`);

      // 🔁 Generate and issue new tokens
      await this.generateTokens(req, res, user);
      logger.info(`🔐 [RefreshToken] New tokens issued ➔ UserID: ${user.id}`);

      return res.status(StatusCodes.OK).json({
        message: "Token refreshed successfully.",
        data: {
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      logger.error("⚠️ [RefreshToken] Error occurred while refreshing token", {
        error,
      });
      next(error);
    }
  }
}
