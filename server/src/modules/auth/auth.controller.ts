// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "modules/voter/voter.dto";
import { AuthService } from "modules/auth/auth.service";

import { StatusCodes } from "http-status-codes";

import logger from "logger";

import { jwtService } from "utils/jwt-service.utils";
import { AppError } from "utils/exceptions.utils";
import { VoterService } from "modules/voter/voter.service";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";
import { env } from "utils/env-config.utils";
import { AuditService } from "modules/audit/audit.service";
import { AuditAction } from "modules/audit/audit.enums";

import { auditLogUtil } from "utils/audit-log.utils";
import { Types } from "mongoose";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(VoterService) private voterService: VoterService,
    @inject(AuditService) private auditService: AuditService
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

      // 3️⃣ Save register event to audit log
      const dto = auditLogUtil.payload(
        req,
        AuditAction.USER_REGISTERED,
        voterData,
        voter.id
      );
      await this.auditService.logAction(dto);

      // 4️⃣ Respond with voter info
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
        signInDTO.password,
        req
      );
      logger.info(
        `✅ [Login] Credentials verified ➔ UserID: ${voter.id}, Email: ${voter.email}`
      );

      if (voter.is2FAEnabled) {
        logger.info(
          `🔐 [Login] 2FA enabled for user ➔ UserID: ${voter.id}, Email: ${voter.email}`
        );
        const token = jwtService.twoFAChallengeToken(voter.id);
        return res.status(StatusCodes.OK).json({
          message: "You're almost there! Please enter your 6-digit OTP.",
          data: {
            is2FAEnabled: true,
            token,
          },
        });
      }
      // 2️⃣ Issue access and refresh tokens
      await this.authService.generateTokens(req, res, voter);
      logger.info(
        `🔐 [Login] Tokens generated and cookies set ➔ UserID: ${voter.id}`
      );

      // 3️⃣ Save login event to audit log
      const meta = {
        email: voter.email,
        fullName: voter.fullName,
        isAdmin: voter.isAdmin,
      };
      const dto = auditLogUtil.payload(req, AuditAction.LOGIN_SUCCESS, meta);
      await this.auditService.logAction(dto);
      logger.info(
        `📝 [Audit] Login event recorded ➔ UserID: ${voter.id}, Action: ${dto.action}`
      );
      // 4️⃣ Respond with voter info
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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies[jwtService.refreshTokenName];
      let meta = undefined;
      let userId: Types.ObjectId | undefined = undefined;

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
          meta = {
            userId: decoded.userId,
            tokenId: decoded.id,
          };
        } catch (verifyErr) {
          const err =
            verifyErr instanceof Error
              ? verifyErr
              : new Error(String(verifyErr));
          logger.warn(
            "⚠️ [Logout] Failed to decode refresh token during logout",
            { verifyErr }
          );
          meta = {
            error: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          };
        }
        // 🧼 Always clear cookies regardless of token validity
        jwtService.clearAuthCookies(res, req);
      }

      // Save login event to audit log
      const dto = auditLogUtil.payload(req, AuditAction.LOGOUT, meta, userId);
      await this.auditService.logAction(dto);
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
        jwtService.clearAuthCookies(res, req);
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

      const user = await this.voterService.getById(refreshToken.userId);
      if (!user) {
        logger.warn(
          `❌ [RefreshToken] User not found ➔ UserID: ${refreshToken.userId}`
        );
        // Save failed token attempt to audit log
        const dto = auditLogUtil.payload(
          req,
          AuditAction.REFRESH_TOKEN_INVALID_USER,
          { reason: "User does not exist", tokenId: refreshToken.id },
          refreshToken.userId
        );
        await this.auditService.logAction(dto);
        throw new AppError("User no longer exists.", StatusCodes.UNAUTHORIZED);
      }

      logger.info(`✅ [RefreshToken] User validated ➔ ${user.email}`);

      // 🔁 Generate and issue new tokens
      await this.authService.generateTokens(req, res, user);
      logger.info(`🔐 [RefreshToken] New tokens issued ➔ UserID: ${user.id}`);

      // Save token attempt to audit log
      const dto = auditLogUtil.payload(
        req,
        AuditAction.REFRESH_TOKEN,
        {
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        },
        refreshToken.userId
      );
      await this.auditService.logAction(dto);

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
