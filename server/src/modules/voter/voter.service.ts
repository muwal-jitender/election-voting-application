import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";
import { VoterDocument } from "./voter.model";

// Voter Service
@singleton()
export class VoterService {

  constructor(@inject(VoterRepository) private voterRepository: VoterRepository) {}


  async registerVoter(data: RegisterVoterDTO &{isAdmin:boolean}) {
    return await this.voterRepository.create(data);
  }

  async getAllVoters() {
    return await this.voterRepository.findAll();
  }
  async findByEmail(email: string) {
    return await this.voterRepository.findOneByField('email', email);
  }

   /** Check login credentials */
   async checkCredentials(email: string, password: string): Promise<VoterDocument | null> {
    const voter = await this.voterRepository.findOneByFieldWithSelect('email', email, ["password"]);
    if (!voter) {
      return null;
    }
 
    const isMatch = await bcrypt.compare(password, voter.password);
    return isMatch ? voter : null;
  }
}