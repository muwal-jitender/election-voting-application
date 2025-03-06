import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";
import { VoterDocument } from "./voter.model";
import jwt from "jsonwebtoken";
import { env } from "../../utils/env-config.utils";
import type { StringValue } from "ms";
// Voter Service
@singleton()
export class VoterService {
  constructor(
    @inject(VoterRepository) private voterRepository: VoterRepository
  ) {}

  async registerVoter(data: RegisterVoterDTO & { isAdmin: boolean }) {
    return await this.voterRepository.create(data);
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
  ): Promise<VoterDocument | null> {
    const voter = await this.voterRepository.findOneByFieldWithSelect(
      "email",
      email,
      ["_id", "email", "password", "isAdmin"]
    );
    if (!voter) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, voter.password);
    return isMatch ? voter : null;
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
