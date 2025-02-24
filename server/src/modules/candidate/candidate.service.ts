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
  async update(data: CandidateDTO, electionId: string) {
    return await this.candidateRepository.update(electionId, data);
  }

  async getAll() {
    return await this.candidateRepository.findAll();
  }
  async getAllByElectionId(id: string) {
    return await this.candidateRepository.findAll({ electionId: id });
  }
}
