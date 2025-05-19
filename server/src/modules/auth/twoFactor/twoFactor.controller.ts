import { NextFunction, Request, Response } from "express";

import { AccessTokenPayload } from "utils/extend-express-request.utils";
import QRCode from "qrcode";
import logger from "logger";
import speakeasy from "speakeasy";
import { inject, injectable } from "tsyringe";
import { AuditService } from "modules/audit/audit.service";
import { AuditAction } from "modules/audit/audit.enums";
import { auditLogUtil } from "utils/audit-log.utils";

@injectable()
export class TwoFactorController {
  constructor(@inject(AuditService) private auditService: AuditService) {}

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

      // 3️⃣ Save register event to audit log
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
        qrCodeImage,
        secret: secret.base32,
      });
    } catch (error) {
      logger.error("❌ [2FA Setup] Failed to generate TOTP secret", {
        error,
        userId: req.user?.userId,
      });
      next(error);
    }
  }
}
