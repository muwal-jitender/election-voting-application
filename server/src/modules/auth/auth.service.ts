import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";

import { StatusCodes } from "http-status-codes";

import { RefreshTokenDTO } from "./auth.dto";
import { RegisterVoterDTO } from "modules/voter/voter.dto";
import { AuthRepository } from "./auth.repository";
import { VoterDocument } from "modules/voter/voter.model";
import { env } from "utils/env-config.utils";
import { AppError } from "utils/exceptions.utils";

import logger from "logger";

import { jwtService } from "utils/jwt.utils";
import { VoterRepository } from "modules/voter/voter.repository";
import { RefreshTokenPayload } from "utils/extend-express-request.utils";
import { Types } from "mongoose";
import { runTransactionWithRetry } from "utils/db-transaction.utils";
import { IRefreshTokenDocument } from "./auth.model";
@singleton()
export class AuthService {
  constructor(
    @inject(AuthRepository) private refreshTokenRepository: AuthRepository,
    @inject(VoterRepository) private voterRepository: VoterRepository
  ) {}

  async registerVoter(data: RegisterVoterDTO) {
    logger.info(`📩 Registering voter ➔ ${data.email}`);
    const emailExists = await this.findByEmail(data.email);
    if (emailExists) {
      logger.warn(`⚠️ Duplicate email registration attempt ➔ ${data.email}`);
      throw new AppError(
        "This email is already registered. Try signing in instead.",
        StatusCodes.CONFLICT
      );
    }

    const voter = await this.voterRepository.create({
      ...data,
      isAdmin: false,
    });

    logger.info(`✅ Registration successful ➔ ${data.email}`);
    return voter;
  }
  async saveRefreshToken(
    data: RefreshTokenDTO
  ): Promise<IRefreshTokenDocument> {
    return await runTransactionWithRetry<IRefreshTokenDocument>(
      async (session) => {
        logger.info(
          `🔄 Updating multiple documents to "isRevoked = true" when same user login multiple times from the same device/browser`
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

        logger.info(`📩 Saving new Refresh Token ➔ ${data.userId}`);
        const refreshTokenDetail = await this.refreshTokenRepository.create(
          data,
          session
        );
        logger.info(`✅ Refresh Token Saved Successfully ➔ ${data.userId}`);

        return refreshTokenDetail; // ✅ Now perfectly valid to return it!
      }
    );
  }

  async updateMany(
    voterId: Types.ObjectId,
    ipAddress: string,
    userAgent: string
  ) {
    await this.refreshTokenRepository.updateMany(
      { userId: voterId, isRevoked: false, ipAddress, userAgent },
      { isRevoked: true }
    );
  }
  async update(id: Types.ObjectId) {
    await this.refreshTokenRepository.update(id, { isRevoked: true });
  }

  async findByEmail(email: string) {
    logger.debug(`🔎 Searching voter by email ➔ ${email}`);
    return await this.voterRepository.findOneByField("email", email);
  }

  async findById(id: Types.ObjectId) {
    logger.info(`🔎 Searching refresh-token by ID ➔ ${id}`);
    return await this.refreshTokenRepository.findById(id);
  }
  async findRefreshToken(payload: RefreshTokenPayload, refreshToken: string) {
    logger.info(`🔎 Searching refresh token ➔ ${payload.userId}`);
    const result = await this.refreshTokenRepository.findOneByMultipleSelect(
      ["userId", "id", "ipAddress", "userAgent", "refreshToken"],
      [
        payload.userId,
        payload.id,
        payload.ipAddress,
        payload.userAgent,
        refreshToken,
      ]
    );

    logger.info(`Search complete, returning the result ➔ ${payload.userId}`);
    return result;
  }
  async checkCredentials(
    email: string,
    password: string
  ): Promise<VoterDocument> {
    logger.info(`🔐 Login attempt ➔ ${email}`);

    const voter = await this.voterRepository.findOneByFieldWithSelect(
      "email",
      email,
      ["_id", "fullName", "email", "password", "isAdmin"]
    );

    if (!voter || !(await bcrypt.compare(password, voter.password))) {
      logger.warn(`❌ Login failed ➔ ${email}`);
      throw new AppError(
        "Invalid username or password",
        StatusCodes.UNAUTHORIZED
      );
    }

    logger.info(`✅ Login successful ➔ ${email}`);
    return voter;
  }

  generateAccessToken(voter: VoterDocument): string {
    logger.info(`🎟️ Generating Access token for ➔ ${voter.email}`);
    const payload = {
      id: voter.id,
      email: voter.email,
      isAdmin: voter.isAdmin,
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
    userId: string,
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
    };

    const refreshToken = jwtService.signin(
      payload,
      env.JWT_REFRESH_SECRET,
      "RefreshToken"
    );
    logger.debug(`✅ Refresh token generated for ➔ ${email}`);
    return refreshToken;
  }
}
