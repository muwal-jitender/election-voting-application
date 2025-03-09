import { inject, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionRepository } from "./election.repository";
import mongoose from "mongoose";
import { NotFoundError } from "../../utils/exceptions.utils";
import { CandidateRepository } from "../candidate/candidate.repository";
import { VoterRepository } from "../voter/voter.repository";

// Voter Service
@singleton()
export class ElectionService {
  constructor(
    @inject(ElectionRepository) private electionRepository: ElectionRepository,
    @inject(CandidateRepository)
    private candidateRepository: CandidateRepository
  ) {}

  async create(data: ElectionDTO) {
    return await this.electionRepository.create(data);
  }
  async update(electionId: string, data: ElectionDTO) {
    return await this.electionRepository.update(electionId, data);
  }
  async getById(id: string) {
    const result = await this.electionRepository.findById(id, [
      "voters",
      "candidates",
    ]);
    return result;
  }
  async getAll({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    searchQuery = "",
  }: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    searchQuery?: string;
  }) {
    const filter = searchQuery
      ? {
          $or: [
            { title: new RegExp(searchQuery, "i") },
            { description: new RegExp(searchQuery, "i") },
          ],
        }
      : {};

    return await this.electionRepository.findAllPaginated({
      filter,
      page,
      limit,
      sortBy,
      order,
    });
  }
  async delete(id: string) {
    // ✅ Start a MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // ✅ Check if election exists before proceeding
      const election = await this.electionRepository.findById(id);
      if (!election) throw new NotFoundError("Election not found");
      // ✅ Delete all related records within a transaction
      await this.candidateRepository.deleteMany({ electionId: id }, session);

      // ✅ Delete the election itself
      const deletedElection = await this.electionRepository.delete(id, session);
      if (!deletedElection) {
        throw new NotFoundError("Election deletion failed.");
      }
      session.commitTransaction();
      session.endSession();
      return deletedElection;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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
