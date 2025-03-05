import { inject, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionRepository } from "./election.repository";

// Voter Service
@singleton()
export class ElectionService {
  constructor(
    @inject(ElectionRepository) private electionRepository: ElectionRepository
  ) {}

  async create(data: ElectionDTO) {
    return await this.electionRepository.create(data);
  }
  async update(electionId: string, data: ElectionDTO) {
    return await this.electionRepository.update(electionId, data);
  }
  async getById(id: string) {
    return await this.electionRepository.findById(id);
  }
  async getAll() {
    return await this.electionRepository.findAll();
  }
  async delete(id: string) {
    return await this.electionRepository.delete(id);
  }

  async getVotersWhoAlreadyVoted(id: string) {
    const election = await this.electionRepository.findOneByFieldWithSelect(
      "_id",
      id,
      ["voters"]
    );
    return election;
  }
}
