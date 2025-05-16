import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";

import { StatusCodes } from "http-status-codes";
import { Response, Request } from "express";
import { RefreshTokenDTO } from "./auth.dto";
import { RegisterVoterDTO } from "modules/voter/voter.dto";
import { AuthRepository } from "./auth.repository";
import { VoterDocument } from "modules/voter/voter.model";
import { env } from "utils/env-config.utils";
import { AppError } from "utils/exceptions.utils";

import logger from "logger";

import { jwtService, TokenValidationResult } from "utils/jwt-service.utils";
import { VoterRepository } from "modules/voter/voter.repository";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "utils/extend-express-request.utils";
import { Types } from "mongoose";
import { runTransactionWithRetry } from "utils/db-transaction.utils";
import { IRefreshTokenDocument } from "./auth.model";
import { auditLogUtil } from "utils/audit-log.utils";
import { AuditAction } from "modules/audit/audit.enums";
import { AuditService } from "modules/audit/audit.service";

@singleton()
export class AuthService {
  constructor(
    @inject(AuthRepository) private refreshTokenRepository: AuthRepository,
    @inject(VoterRepository) private voterRepository: VoterRepository,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async registerVoter(data: RegisterVoterDTO) {
    logger.info(`📩 [RegisterVoter] Attempt ➔ ${data.email}`);
    const emailExists = await this.voterRepository.findOneByField(
      "email",
      data.email
    );
    if (emailExists) {
      logger.warn(`⚠️ [RegisterVoter] Duplicate Email ➔ ${data.email}`);
      throw new AppError(
        "This email is already registered. Try signing in instead.",
        StatusCodes.CONFLICT
      );
    }

    const voter = await this.voterRepository.create({
      ...data,
      isAdmin: false,
    });

    logger.info(`✅ [RegisterVoter] Success ➔ ${data.email}`);
    return voter;
  }

  async saveRefreshToken(
    data: RefreshTokenDTO
  ): Promise<IRefreshTokenDocument> {
    return await runTransactionWithRetry<IRefreshTokenDocument>(
      async (session) => {
        logger.info(
          `🔄 [saveRefreshToken] Revoking old tokens for user ➔ ${data.userId}`
        );
        await this.refreshTokenRepository.updateMany(
          {
            userId: data.userId,
            isRevoked: false,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
          },
          { isRevoked: true },
          session
        );

        logger.info(
          `📥 [saveRefreshToken] Creating new token record ➔ ${data.userId}`
        );
        const hashedToken = jwtService.hashToken(data.refreshToken);
        const refreshTokenDetail = await this.refreshTokenRepository.create(
          { ...data, refreshToken: hashedToken },
          session
        );

        logger.info(
          `✅ [saveRefreshToken] Token Saved ➔ TokenID: ${refreshTokenDetail.id}`
        );
        return refreshTokenDetail;
      }
    );
  }
  async update(id: Types.ObjectId) {
    await this.refreshTokenRepository.update(id, { isRevoked: true });
  }
  async checkCredentials(
    email: string,
    password: string,
    req: Request
  ): Promise<VoterDocument> {
    logger.info(`🔐 [Login] Checking credentials ➔ ${email}`);

    const voter = await this.voterRepository.findOneByFieldWithSelect(
      { email },
      ["_id", "fullName", "email", "password", "isAdmin"]
    );

    if (!voter || !(await bcrypt.compare(password, voter.password))) {
      logger.warn(`❌ [Login] Invalid credentials ➔ ${email}`);

      // Save login event to audit log
      const meta = {
        email,
      };
      const dto = auditLogUtil.payload(req, AuditAction.LOGIN_FAILED, meta);
      await this.auditService.logAction(dto);
      // Throw error
      throw new AppError(
        "Invalid username or password",
        StatusCodes.UNAUTHORIZED
      );
    }

    logger.info(`✅ [Login] Authentication successful ➔ ${email}`);
    return voter;
  }

  async validateRefreshToken(
    decoded: RefreshTokenPayload,
    incomingToken: string,
    res: Response,
    meta: { ipAddress: string; userAgent: string }
  ): Promise<TokenValidationResult> {
    logger.info(
      `🔍 [validateRefreshToken] Verifying token for ➔ ${decoded.userId}`
    );

    const dbRefreshToken = await this.refreshTokenRepository.findById(
      decoded.id
    );

    // ❌ Case 1: Token not found — may have been revoked or expired
    if (!dbRefreshToken) {
      logger.warn("❌ [TokenCheck] Token not found in DB");

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any, // simulated req
        AuditAction.TOKEN_REVOKED,
        {
          reason: "Refresh token not found",
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "Refresh token no longer exists.",
      };
    }

    const incomingHashedToken = jwtService.hashToken(incomingToken);

    // ❌ Case 2: Token reuse detected
    if (incomingHashedToken !== dbRefreshToken.refreshToken) {
      logger.warn("🚨 [TokenReuse] Hashed mismatch ➔ Reuse suspected!");

      await this.revokeAllTokensByUserId(decoded.userId);
      jwtService.clearAuthCookies(res, decoded.userId, meta);

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
        AuditAction.TOKEN_REUSE,
        {
          reason: "Refresh token reuse detected",
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "Token reuse detected.",
      };
    }

    // ❌ Case 3: Token was explicitly revoked
    if (dbRefreshToken.isRevoked) {
      logger.warn("🚫 [TokenStatus] Token is revoked");

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
        AuditAction.TOKEN_REVOKED,
        {
          reason: "Token marked as revoked",
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "Refresh token revoked.",
      };
    }

    // ❌ Case 4: Token expired
    if (dbRefreshToken.expiresAt.getTime() < Date.now()) {
      logger.warn("⏰ [TokenExpiry] Token expired");

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
        AuditAction.TOKEN_REVOKED,
        {
          reason: "Refresh token expired",
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "Refresh token expired.",
      };
    }

    // ❌ Case 5: IP address mismatch
    if (dbRefreshToken.ipAddress !== meta.ipAddress) {
      logger.warn(
        `🛑 [IPMismatch] IP changed ➔ Expected: ${dbRefreshToken.ipAddress}, Got: ${meta.ipAddress}`
      );

      await this.revokeAllTokensByUserId(decoded.userId);
      jwtService.clearAuthCookies(res, decoded.userId, meta);

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
        AuditAction.IP_MISMATCH,
        {
          reason: "IP address mismatch",
          expectedIp: dbRefreshToken.ipAddress,
          receivedIp: meta.ipAddress,
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "IP address mismatch.",
      };
    }

    // ❌ Case 6: User-Agent mismatch
    if (dbRefreshToken.userAgent !== meta.userAgent) {
      logger.warn(
        `🛑 [User-Agent Mismatch] UA changed ➔ Expected: ${dbRefreshToken.userAgent}, Got: ${meta.userAgent}`
      );

      await this.revokeAllTokensByUserId(decoded.userId);
      jwtService.clearAuthCookies(res, decoded.userId, meta);

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
        AuditAction.UA_MISMATCH,
        {
          reason: "User-Agent mismatch",
          expectedUA: dbRefreshToken.userAgent,
          receivedUA: meta.userAgent,
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "User agent mismatch.",
      };
    }

    // ❌ Case 7: Version mismatch (e.g., after password change or app update)
    if (decoded.version !== jwtService.currentTokenVersion) {
      logger.warn(
        `⚙️ [VersionMismatch] Expected: ${jwtService.currentTokenVersion}, Got: ${decoded.version}`
      );

      await this.revokeAllTokensByUserId(decoded.userId);
      jwtService.clearAuthCookies(res, decoded.userId, meta);

      const dto = auditLogUtil.payload(
        { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
        AuditAction.TOKEN_REVOKED,
        {
          reason: "Token version mismatch",
          expectedVersion: jwtService.currentTokenVersion,
          receivedVersion: decoded.version,
          tokenId: decoded.id.toString(),
        },
        decoded.userId
      );
      await this.auditService.logAction(dto);

      return {
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        message: "Outdated token version.",
      };
    }

    // ✅ Case: All validations passed
    logger.info(
      `✅ [validateRefreshToken] Token is valid for ➔ ${decoded.userId}`
    );

    // Track when this token was last used
    dbRefreshToken.usedAt = new Date();
    await dbRefreshToken.save();

    const successAudit = auditLogUtil.payload(
      { ip: meta.ipAddress, userAgent: meta.userAgent } as any,
      AuditAction.REFRESH_TOKEN,
      {
        tokenId: decoded.id.toString(),
        usedAt: dbRefreshToken.usedAt,
      },
      decoded.userId
    );
    await this.auditService.logAction(successAudit);

    // Optional delay to reduce replay attacks
    await new Promise((resolve) => global.setTimeout(resolve, 1500)); // 1.5s delay

    return { success: true, token: dbRefreshToken };
  }

  generateAccessToken(voter: VoterDocument): string {
    logger.info(`🎟️ Generating Access token for ➔ ${voter.email}`);
    const payload: AccessTokenPayload = {
      userId: voter.id,
      email: voter.email,
      isAdmin: voter.isAdmin,
      version: jwtService.currentTokenVersion,
    };

    const accessToken = jwtService.signin(
      payload,
      env.JWT_ACCESS_SECRET,
      "AccessToken"
    );
    logger.debug(`✅ Access token generated for ➔ ${voter.email}`);
    return accessToken;
  }
  generateRefreshToken(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): string {
    logger.info(`🎟️ Generating Refresh token for ➔ ${email}`);
    const payload: RefreshTokenPayload = {
      userId,
      id,
      ipAddress,
      userAgent,
      version: jwtService.currentTokenVersion,
    };

    const refreshToken = jwtService.signin(
      payload,
      env.JWT_REFRESH_SECRET,
      "RefreshToken"
    );
    logger.debug(`✅ Refresh token generated for ➔ ${email}`);
    return refreshToken;
  }
  async revokeAllTokensByUserId(userId: Types.ObjectId) {
    logger.warn(`🧹 [RevokeAll] Revoking all tokens for user ➔ ${userId}`);
    await this.refreshTokenRepository.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }
}
