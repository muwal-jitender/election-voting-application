import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";
import { VoterDocument } from "./voter.model";
import { env } from "utils/env-config.utils";
import { AppError } from "utils/exceptions.utils";
import { stripMongoMeta } from "utils/utils";
import type { StringValue } from "ms";
import logger from "logger";

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

  generateToken(voter: VoterDocument): string {
    logger.info(`🎟️ Generating JWT token for ➔ ${voter.email}`);
    const payload = {
      id: voter.id,
      email: voter.email,
      isAdmin: voter.isAdmin,
    };
    const options = { expiresIn: env.JWT_EXPIRES_IN as StringValue };
    const token = jwt.sign(payload, env.JWT_SECRET, options);
    logger.debug(`✅ Token generated for ➔ ${voter.email}`);
    return token;
  }
}
