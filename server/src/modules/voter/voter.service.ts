import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";

import { StatusCodes } from "http-status-codes";

import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";
import { VoterDocument } from "./voter.model";
import { env } from "utils/env-config.utils";
import { AppError } from "utils/exceptions.utils";
import { stripMongoMeta } from "utils/utils";

import logger from "logger";
import { v4 as uuidv4 } from "uuid";
import { jwtService } from "utils/jwt-service.utils";
@singleton()
export class VoterService {
  constructor(
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

  async getAllVoters() {
    logger.info("📄 Fetching all voters...");
    const voters = await this.voterRepository.findAll();
    logger.info(`✅ Found ${voters.length} voters`);
    return voters;
  }

  async getAllVotersByElectionId(id: string) {
    logger.info(`📄 Fetching voters for election ➔ ${id}`);
    return await this.voterRepository.findAll({ electionId: id });
  }

  async getVoterById(id: string) {
    logger.info(`🔍 Fetching voter by ID ➔ ${id}`);
    return await this.voterRepository.findById(id);
  }

  async getUserDetail(voterId: string | undefined) {
    logger.info(`🔐 Fetching user detail ➔ voterId=${voterId}`);
    if (!voterId) {
      logger.warn("❌ No voter ID found in session");
      throw new AppError("No logged-in user id found", StatusCodes.NOT_FOUND);
    }

    const voter = await this.voterRepository.findDocumentById(
      voterId,
      [],
      undefined,
      ["fullName", "email", "isAdmin"]
    );

    if (!voter) {
      logger.warn(`❌ Voter not found for ID ➔ ${voterId}`);
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    logger.info(`✅ Voter found ➔ ${voterId}`);
    return stripMongoMeta(voter);
  }

  async findByEmail(email: string) {
    logger.debug(`🔎 Searching voter by email ➔ ${email}`);
    return await this.voterRepository.findOneByField("email", email);
  }

  async findByIds(ids: string[]) {
    logger.debug(`🔎 Searching voters by IDs ➔ ${ids.join(", ")}`);
    return await this.voterRepository.findByIds(ids);
  }

  async checkCredentials(
    email: string,
    password: string
  ): Promise<VoterDocument> {
    logger.info(`🔐 Login attempt ➔ ${email}`);

    const voter = await this.voterRepository.findOneByFieldWithSelect(
      { email },
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
    userId: number,
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): string {
    logger.info(`🎟️ Generating Refresh token for ➔ ${email}`);
    const payload = {
      id: userId,
      tokenId: uuidv4(),
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
