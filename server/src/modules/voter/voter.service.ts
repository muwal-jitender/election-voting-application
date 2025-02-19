import { inject, singleton } from "tsyringe";

import { RegisterVoterDTO } from "./voter.dto";
import { VoterRepository } from "./voter.repository";

// Voter Service
@singleton()
export class VoterService {

  constructor(@inject(VoterRepository) private voterRepository: VoterRepository) {}


  async registerVoter(data: RegisterVoterDTO) {
    return await this.voterRepository.create(data);
  }

  async getAllVoters() {
    return await this.voterRepository.findAll();
  }
}