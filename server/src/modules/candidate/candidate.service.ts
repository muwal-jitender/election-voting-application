import { inject, singleton } from "tsyringe";
import { CandidateDTO } from "./candidate.dto";
import { CandidateRepository } from "./candidate.repository";
import mongoose from "mongoose";
import { ElectionRepository } from "modules/election/election.repository";
import { AppError } from "utils/exceptions.utils";
import { deleteFile, uploadFile } from "utils/file.utils";
import { VoterRepository } from "modules/voter/voter.repository";
import { FileArray } from "express-fileupload";
import { ElectionService } from "modules/election/election.service";
import { StatusCodes } from "http-status-codes";
import logger from "logger"; // ✅ Your Winston logger

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
      logger.info(`🧾 Creating candidate ➔ ${data.fullName}`);

      newImageUrl = await uploadFile(files, "image", data.image);

      const newCandidate = await this.candidateRepository.create(
        {
          ...data,
          image: newImageUrl,
        },
        session
      );

      await this.electionRepository.update(
        data.electionId,
        { $push: { candidates: newCandidate.id } },
        session
      );

      await session.commitTransaction();
      session.endSession();

      logger.info(`✅ Candidate created successfully ➔ ${newCandidate.id}`);
      return newCandidate;
    } catch (error) {
      if (newImageUrl) {
        await deleteFile(newImageUrl);
      }

      await session.abortTransaction();
      session.endSession();

      logger.error(`❌ Failed to create candidate ➔ ${data.fullName}`, {
        error,
      });
      throw error;
    }
  }

  async voteCandidate(id: string, voterId: string, electionId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      logger.info(
        `🗳️ Voting ➔ candidate: ${id}, voter: ${voterId}, election: ${electionId}`
      );

      const election =
        await this.electionService.getVotersWhoAlreadyVoted(electionId);
      if (!election) {
        logger.warn(`⚠️ Election not found ➔ ${electionId}`);
        throw new AppError("Election not found", StatusCodes.BAD_REQUEST);
      }

      if (election.voters.find((id) => id.toString() === voterId)) {
        logger.warn(
          `⚠️ Voter already voted ➔ voter: ${voterId}, election: ${electionId}`
        );
        throw new AppError("Voter already voted", StatusCodes.BAD_REQUEST);
      }

      const dbCandidate = await this.candidateRepository.findById(
        id,
        [],
        session
      );
      if (!dbCandidate) {
        logger.warn(`⚠️ Candidate not found ➔ ${id}`);
        throw new AppError("Candidate not found", StatusCodes.NOT_FOUND);
      }

      const dbElection = await this.electionRepository.findById(
        electionId,
        [],
        session
      );
      if (!dbElection) {
        logger.warn(`⚠️ Election not found ➔ ${electionId}`);
        throw new AppError("Election not found", StatusCodes.NOT_FOUND);
      }

      await this.candidateRepository.update(
        id,
        { $inc: { voteCount: 1 } },
        session
      );
      await this.electionRepository.update(
        electionId,
        { $push: { voters: voterId } },
        session
      );
      await this.voterRepository.update(
        voterId,
        { $push: { votedElectionIds: dbElection._id } },
        session
      );

      await session.commitTransaction();
      session.endSession();

      logger.info(
        `✅ Vote cast successfully ➔ voter: ${voterId}, candidate: ${id}`
      );
      return dbCandidate;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error("❌ Vote operation failed", { error });
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
      logger.info(`🗑️ Deleting candidate ➔ ${id}`);
      const candidate = await this.candidateRepository.findById(id);
      if (!candidate) {
        logger.warn(`⚠️ Candidate not found ➔ ${id}`);
        throw new AppError("Candidate not found", StatusCodes.NOT_FOUND);
      }

      await this.candidateRepository.delete(id, session);
      await this.electionRepository.update(
        candidate.electionId,
        { $pull: { candidates: id } },
        session
      );

      if (candidate.image) {
        await deleteFile(candidate.image);
      }

      await session.commitTransaction();
      session.endSession();

      logger.info(`✅ Candidate deleted successfully ➔ ${id}`);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`❌ Failed to delete candidate ➔ ${id}`, { error });
      throw error;
    }
  }

  async deleteMany(electionId: string) {
    logger.info(`🧹 Deleting candidates for election ➔ ${electionId}`);
    return await this.candidateRepository.deleteMany({ electionId });
  }
}
