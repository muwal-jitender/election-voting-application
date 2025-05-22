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

@injectable()
export class TwoFactorController {
  constructor(
    @inject(AuditService) private auditService: AuditService,
    @inject(VoterService) private voterService: VoterService
  ) {}

  async generateTOTPSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AccessTokenPayload;

      const secret = speakeasy.generateSecret({
        name: `MyVotingApp (${user.email})`,
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
          .status(400)
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
          .status(401)
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
        .status(200)
        .json({ message: "Two-factor authentication successfully enabled." });
    } catch (error) {
      logger.error("❌ [2FA Verify] Verification failed", { error });
      next(error);
    }
  }
}
