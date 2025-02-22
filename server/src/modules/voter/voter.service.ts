import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";
import { VoterDocument } from "./voter.model";
import jwt from "jsonwebtoken";
import { config } from "../../utils/config";
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
  async getVoterById(id: string) {
    return await this.voterRepository.findById(id);
  }
  async findByEmail(email: string) {
    return await this.voterRepository.findOneByField("email", email);
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
    const options = { expiresIn: parseInt(config.JWT_EXPIRES_IN, 10) }; // Explicitly define type

    return jwt.sign(payload, config.JWT_SECRET, options);
  }
}
