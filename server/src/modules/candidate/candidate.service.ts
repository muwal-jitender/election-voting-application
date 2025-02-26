import { inject, singleton } from "tsyringe";

import { CandidateDTO } from "./candidate.dto";
import { CandidateRepository } from "./candidate.repository";

// Voter Service
@singleton()
export class CandidateService {
  constructor(
    @inject(CandidateRepository)
    private candidateRepository: CandidateRepository
  ) {}

  async create(data: CandidateDTO) {
    return await this.candidateRepository.create(data);
  }
  async update(id: string, data: CandidateDTO) {
    return await this.candidateRepository.update(id, data);
  }

  async getAll() {
    return await this.candidateRepository.findAll();
  }
  async getById(id: string) {
    return await this.candidateRepository.findById(id);
  }
  async getAllByElectionId(id: string) {
    return await this.candidateRepository.findAll({ electionId: id });
  }

  async delete(id: string) {
    return await this.candidateRepository.delete(id);
  }

  /**
   * Delete candidates based on Election-Id
   * @param electionId
   * @returns
   */
  async deleteMany(electionId: string) {
    return await this.candidateRepository.deleteMany({ electionId });
  }
}
