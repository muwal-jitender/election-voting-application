import { inject, singleton } from "tsyringe";

import { CandidateDTO } from "./candidate.dto";
import { CandidateRepository } from "./candidate.repository";
import mongoose from "mongoose";
import { ElectionRepository } from "modules/election/election.repository";
import { BadRequestError, NotFoundError } from "utils/exceptions.utils";
import { deleteFile, uploadFile } from "utils/file.utils";
import { VoterRepository } from "modules/voter/voter.repository";
import { FileArray } from "express-fileupload";
import { ElectionService } from "modules/election/election.service";
// Voter Service
@singleton()
export class CandidateService {
  constructor(
    @inject(CandidateRepository)
    private candidateRepository: CandidateRepository,
    @inject(ElectionRepository) private electionRepository: ElectionRepository,
    @inject(VoterRepository) private voterRepository: VoterRepository,
    @inject(ElectionService) private electionService: ElectionService
  ) {}

  /** Create a new candidate and push into election */
  async create(data: CandidateDTO, files: FileArray | null | undefined) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let newImageUrl: string | null = null;
    try {
      // ✅ Step 1: Upload image on Cloud as well on Local Storage
      newImageUrl = await uploadFile(files, "image", data.image);

      // ✅ Step 1: Create the new candidate
      const newCandidate = await this.candidateRepository.create(
        {
          ...data,
          image: newImageUrl,
        },
        session
      );
      // ✅ Step 2: Push the new candidate into the election's `candidates` array
      await this.electionRepository.update(
        data.electionId,
        {
          $push: { candidates: newCandidate.id },
        },
        session
      );
      // ✅ Step 3: Commit the transaction if both operations succeed
      await session.commitTransaction();
      session.endSession();

      return newCandidate;
    } catch (error) {
      // ❌ Remove the image in case of an exception
      if (newImageUrl) {
        await deleteFile(newImageUrl);
      }
      // ❌ If any operation fails, rollback the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  /** Update Candidate, Voter, and Election collections once a user has voted */
  async voteCandidate(id: string, voterId: string, electionId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // ✅ Step 1: Ensure election exists
      const election =
        await this.electionService.getVotersWhoAlreadyVoted(electionId);
      if (!election) {
        throw new BadRequestError("Election not found");
      }

      // ✅ Step 2: Ensure voter exists
      if (
        election.voters.length > 0 &&
        election.voters.find((id) => id.toString() === voterId)
      ) {
        throw new BadRequestError("Voter already voted");
      }

      // ✅ Step 3: Get Candidate and ensure it exists
      const dbCandidate = await this.candidateRepository.findById(
        id,
        [],
        session
      );
      if (!dbCandidate) {
        throw new NotFoundError("Candidate not found");
      }

      // ✅ Step 4: Get Election and ensure it exists
      const dbElection = await this.electionRepository.findById(
        electionId,
        [],
        session
      );
      if (!dbElection) {
        throw new NotFoundError("Election not found");
      }

      // ✅ Step 5: Increment Candidate Vote Count (Efficient Update)
      const result = await this.candidateRepository.update(
        id,
        { $inc: { voteCount: 1 } }, // ✅ Efficient increment without fetching full document
        session
      );

      // ✅ Step 6: Update Election with Voter ID
      await this.electionRepository.update(
        electionId,
        { $push: { voters: voterId } }, // ✅ Use `_id` not `id`
        session
      );

      // ✅ Step 7: Update Voter with Election ID
      await this.voterRepository.update(
        voterId,
        { $push: { votedElectionIds: dbElection._id } }, // ✅ Use `_id` not `id`
        session
      );

      // ✅ Step 8: Commit transaction before returning
      await session.commitTransaction();
      session.endSession();

      return result;
    } catch (error) {
      // ❌ Rollback the transaction if anything fails
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAll() {
    return await this.candidateRepository.findAll();
  }
  async getById(id: string) {
    return await this.candidateRepository.findById(id, ["electionId"]);
  }
  async findByIds(ids: string[]) {
    return await this.candidateRepository.findByIds(ids);
  }
  async getAllByElectionId(id: string) {
    return await this.candidateRepository.findAll({ electionId: id });
  }

  async delete(id: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // ✅ Step 1: Find the candidate to get the `electionId`
      const candidate = await this.candidateRepository.findById(id);
      if (!candidate) {
        throw new NotFoundError("Candidate not found");
      }

      // ✅ Step 2: Remove candidate from `candidates` collection
      await this.candidateRepository.delete(id, session);

      // ✅ Step 3: Remove candidate from the `election.candidates` array
      await this.electionRepository.update(
        candidate.electionId,
        {
          $pull: { candidates: id }, // ✅ Removes the candidate ID from the array
        },
        session
      );

      // ✅ Step 4: Remove candidate image from cloudinary and locally
      if (candidate.image) {
        await deleteFile(candidate.image);
      }

      // ✅ Step 4: Commit the transaction
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      // ❌ Rollback the transaction if anything fails
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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
