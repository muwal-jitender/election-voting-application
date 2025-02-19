import { inject, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionRepository } from "./election.repository";

// Voter Service
@singleton()
export class ElectionService {

  constructor(@inject(ElectionRepository) private electionRepository: ElectionRepository) {}


  async create(data: ElectionDTO) {
    return await this.electionRepository.create(data);
  }
  async update(data: ElectionDTO, electionId: string) {
    return await this.electionRepository.update( electionId, data);
  }

  async getAll() {
    return await this.electionRepository.findAll();
  }
}