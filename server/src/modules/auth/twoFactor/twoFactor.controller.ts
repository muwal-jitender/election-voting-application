import { NextFunction, Request, Response } from "express";

import { AccessTokenPayload } from "utils/extend-express-request.utils";
import QRCode from "qrcode";
import logger from "logger";
import speakeasy from "speakeasy";
import { inject, injectable } from "tsyringe";
import { AuditService } from "modules/audit/audit.service";
import { AuditAction } from "modules/audit/audit.enums";
import { auditLogUtil } from "utils/audit-log.utils";
import { VoterService } from "modules/voter/voter.service";
import { encryptionService } from "utils/encryption.service.utils";
import { StatusCodes } from "http-status-codes";
import { jwtService, TwoFAPayload } from "utils/jwt-service.utils";
import { env } from "utils/env-config.utils";
import { AppError } from "utils/exceptions.utils";
import { AuthService } from "../auth.service";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

@injectable()
export class TwoFactorController {
  constructor(
    @inject(AuditService) private auditService: AuditService,
    @inject(VoterService) private voterService: VoterService,
    @inject(AuthService) private authService: AuthService
  ) {}

  async generateTOTPSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AccessTokenPayload;

      const secret = speakeasy.generateSecret({
        name: `MyVotingApp (${user.email})`,
        length: 20, // 🔒 Yields ~32 base32 characters
      });

      if (!secret.otpauth_url) {
        throw new Error("Failed to generate otpauth URL for TOTP secret.");
      }
      const qrCodeImage = await QRCode.toDataURL(secret.otpauth_url);

      logger.info("🔐 [2FA Setup] TOTP secret generated", {
        userId: user.userId,
        email: user.email,
      });

      // Save generate TOTP event to audit log
      const dto = auditLogUtil.payload(
        req,
        AuditAction.USER_REGISTERED,
        {
          email: user.email,
        },
        user.userId
      );
      await this.auditService.logAction(dto);

      return res.status(200).json({
        message: "TOTP secret generated successfully.",
        data: {
          qrCodeImage,
          secret: secret.base32,
        },
      });
    } catch (error) {
      logger.error("❌ [2FA Setup] Failed to generate TOTP secret", {
        error,
        userId: req.user?.userId,
      });
      next(error);
    }
  }
  async verifyTOTPCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, secret } = req.body;
      const user = req.user as AccessTokenPayload;

      if (!code || !secret) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Code and secret are required." });
      }

      const isValid = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: code,
        window: 1, // allow ±30 sec clock drift
      });

      if (!isValid) {
        logger.warn("❌ [2FA Verify] Invalid TOTP code", {
          userId: user?.userId,
        });

        const dto = auditLogUtil.payload(
          req,
          AuditAction.TWO_FA_VERIFICATION_FAILED,
          {
            email: user.email,
          },
          user.userId
        );

        await this.auditService.logAction(dto);

        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid authentication code." });
      }

      // ✅ Valid – save secret to DB
      const encryptedSecret = encryptionService.encrypt(secret);
      await this.voterService.update(user.userId, {
        totpSecret: encryptedSecret,
        is2FAEnabled: true,
      });

      logger.info("✅ [2FA Verify] TOTP verified and saved", {
        userId: user.userId,
      });

      const dto = auditLogUtil.payload(
        req,
        AuditAction.TWO_FA_VERIFICATION_SUCCESS,
        {
          email: user.email,
        },
        user.userId
      );

      await this.auditService.logAction(dto);

      res
        .status(StatusCodes.OK)
        .json({ message: "Two-factor authentication successfully enabled." });
    } catch (error) {
      logger.error("❌ [2FA Verify] Verification failed", { error });
      next(error);
    }
  }

  async verify2FA(req: Request, res: Response, next: NextFunction) {
    const { token: challengeToken, otp } = req.body;

    try {
      const payload = this.verifyToken(challengeToken) as TwoFAPayload;

      if (payload.step !== "2fa")
        throw new AppError("Invalid Token", StatusCodes.UNAUTHORIZED);

      const user = await this.voterService.getById(payload.userId);
      if (!user) {
        throw new AppError("Invalid OTP", StatusCodes.UNAUTHORIZED);
      }
      const decryptedSecret = encryptionService.decrypt(user.totpSecret);

      const isValid = speakeasy.totp.verify({
        secret: decryptedSecret,
        encoding: "base32",
        token: otp,
        window: 1,
      });
      if (!isValid) {
        throw new AppError("Invalid OTP", StatusCodes.UNAUTHORIZED);
      }

      // ✅ OTP Valid — now generate tokens
      await this.authService.generateTokens(req, res, user);

      // Save audit log
      const dto = auditLogUtil.payload(req, AuditAction.LOGIN_SUCCESS, {
        email: user.email,
        fullName: user.fullName,
      });
      await this.auditService.logAction(dto);

      return res.status(StatusCodes.OK).json({
        message: "2FA verification successful, you are now logged in",
        data: {
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      logger.error("[2FA] Failed verification", { error });
      next(error);
    }
  }
  // POST /api/v1/auth/2fa/disable
  async disable2FA(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId; // Assume user is authenticated via middleware
      await this.voterService.disable2FA(userId);

      res.status(200).json({
        message: "Two-Factor Authentication has been disabled.",
      });
    } catch (error) {
      next(error);
    }
  }

  private verifyToken(token: string) {
    try {
      return jwtService.verify(token, env.JWT_ACCESS_SECRET) as TwoFAPayload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AppError(
          "Your session has expired. Please log in again.",
          StatusCodes.UNAUTHORIZED
        );
      }
      if (err instanceof JsonWebTokenError) {
        throw new AppError(
          "Invalid authentication token. Please log in again.",
          StatusCodes.UNAUTHORIZED
        );
      }
      throw new AppError(
        "Something went wrong with token verification.",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
}
