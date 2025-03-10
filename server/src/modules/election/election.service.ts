import { inject, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionRepository } from "./election.repository";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../utils/exceptions.utils";
import { CandidateRepository } from "../candidate/candidate.repository";
import { VoterRepository } from "../voter/voter.repository";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/cloudinary.config";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import { validate } from "class-validator";
import {
  deleteFromLocal,
  uploadFile,
  uploadToLocal,
} from "../../utils/file.utils";
import { plainToClass } from "class-transformer";

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
  async update(
    electionId: string,
    dto: ElectionDTO,
    files: FileArray | null | undefined
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let uploadedFileUrl: string | null = null; // ✅ Track newly uploaded file
    try {
      // ✅ Step 1: Validate election existence
      const existingElection = await this.getById(electionId);
      if (!existingElection) {
        throw new NotFoundError("Election not found.");
      }

      // ✅ Step 2: Validate DTO
      const data: ElectionDTO = plainToClass(ElectionDTO, dto);
      const errors = await validate(data, { skipMissingProperties: true });
      if (errors.length > 0) {
        throw new BadRequestError(
          "Validation failed.",
          errors.map((err) => err.constraints)
        );
      }

      // ✅ Step 3: Process File Upload
      const newThumbnailUrl = await uploadFile(
        files,
        "thumbnail",
        existingElection.thumbnail
      );
      uploadedFileUrl = newThumbnailUrl;

      // ✅ Step 4: Update the DB (inside a transaction)
      const updatedElection = await this.electionRepository.update(
        electionId,
        { ...data, thumbnail: newThumbnailUrl },
        session
      );
      if (!updatedElection) {
        throw new NotFoundError("Election update failed.");
      }

      // ✅ Step 5: Update the DB
      if (existingElection.thumbnail !== newThumbnailUrl) {
        await deleteFromCloudinary(existingElection.thumbnail);
        deleteFromLocal(existingElection.thumbnail);
      }

      // ✅ Step 6: Commit Transaction
      await session.commitTransaction();
      session.endSession();
      return updatedElection;
    } catch (error) {
      // ❌ If the transaction fails, rollback Cloudinary manually to remove the newly uploaded (untracked) file
      if (uploadedFileUrl) {
        await deleteFromCloudinary(uploadedFileUrl);
      }

      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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
