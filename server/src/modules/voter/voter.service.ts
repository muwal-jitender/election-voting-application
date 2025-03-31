import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";
import { VoterDocument } from "./voter.model";
import jwt from "jsonwebtoken";
import { env } from "utils/env-config.utils";
import type { StringValue } from "ms";
import { AppError } from "utils/exceptions.utils";
import { stripMongoMeta } from "utils/utils";
import { StatusCodes } from "http-status-codes";
// Voter Service
@singleton()
export class VoterService {
  constructor(
    @inject(VoterRepository) private voterRepository: VoterRepository
  ) {}

  async registerVoter(data: RegisterVoterDTO) {
    // ✅ Checking if email already exists
    const emailExists = await this.findByEmail(data.email);
    if (emailExists) {
      throw new AppError(
        "This email is already registered. Try signing in instead.",
        StatusCodes.CONFLICT
      );
    }
    // ✅ Explicitly set isAdmin to false, so that no external voter can set itself as Admin
    return await this.voterRepository.create({
      ...data,
      isAdmin: false,
    });
  }

  async getAllVoters() {
    return await this.voterRepository.findAll();
  }
  async getAllVotersByElectionId(id: string) {
    return await this.voterRepository.findAll({ electionId: id });
  }
  async getVoterById(id: string) {
    return await this.voterRepository.findById(id);
  }
  async getUserDetail(voterId: string | undefined) {
    if (!voterId) {
      throw new AppError("No logged-in user id found", StatusCodes.NOT_FOUND);
    }
    // ✅ Fetch only required fields
    const voter = await this.voterRepository.findDocumentById(
      voterId,
      [],
      undefined,
      ["fullName", "email", "isAdmin"]
    );
    if (!voter) throw new AppError("User not found", StatusCodes.NOT_FOUND);
    else return stripMongoMeta(voter);
  }
  async findByEmail(email: string) {
    return await this.voterRepository.findOneByField("email", email);
  }
  async findByIds(ids: string[]) {
    return await this.voterRepository.findByIds(ids);
  }
  /** Check login credentials */
  async checkCredentials(
    email: string,
    password: string
  ): Promise<VoterDocument> {
    // ✅ Fetch only required fields
    const voter = await this.voterRepository.findOneByFieldWithSelect(
      "email",
      email,
      ["_id", "fullName", "email", "password", "isAdmin"]
    );
    // ✅ Verify if voter exists and password also matches
    if (!voter || !(await bcrypt.compare(password, voter.password))) {
      throw new AppError(
        "Invalid username or password",
        StatusCodes.UNAUTHORIZED
      );
    }

    return voter;
  }
  /** Generate JWT token */
  generateToken(voter: VoterDocument): string {
    const payload = {
      id: voter.id,
      email: voter.email,
      isAdmin: voter.isAdmin,
    };
    const options = { expiresIn: env.JWT_EXPIRES_IN as StringValue };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }
}
