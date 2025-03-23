import { inject, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionRepository } from "./election.repository";
import mongoose from "mongoose";
import { NotFoundError } from "../../utils/exceptions.utils";
import { CandidateRepository } from "../candidate/candidate.repository";

import { deleteFromCloudinary } from "../../config/cloudinary.config";
import { FileArray } from "express-fileupload";

import { deleteFile, uploadFile } from "../../utils/file.utils";

import { ElectionDocument } from "./election.model";

// Voter Service
@singleton()
export class ElectionService {
  constructor(
    @inject(ElectionRepository) private electionRepository: ElectionRepository,
    @inject(CandidateRepository)
    private candidateRepository: CandidateRepository
  ) {}

  async create(data: ElectionDTO, files: FileArray | null | undefined) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // ✅ Step 1: Start file upload
      const newThumbnailUrl = await uploadFile(files, "thumbnail");
      // ✅ Step 2: Create new election
      const newElection = await this.electionRepository.create({
        ...data,
        thumbnail: newThumbnailUrl,
      });
      // ✅ Step 3: Commit Transaction and return result
      await session.commitTransaction();
      session.endSession();
      return newElection;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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

      // ✅ Step 2: Assign DTO
      const data: ElectionDTO = dto;

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
        await deleteFile(existingElection.thumbnail);
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
    let deletedElection: ElectionDocument | null = null;
    try {
      // ✅ Check if election exists before proceeding
      const election = await this.electionRepository.findById(id);
      if (!election) throw new NotFoundError("Election not found");
      // ✅ Delete all related records within a transaction
      await this.candidateRepository.deleteMany({ electionId: id }, session);

      // ✅ Delete the election itself
      deletedElection = await this.electionRepository.delete(id, session);
      if (!deletedElection) {
        throw new NotFoundError("Election deletion failed.");
      }

      await session.commitTransaction();

      return deletedElection;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      if (deletedElection?.thumbnail) {
        try {
          await deleteFile(deletedElection.thumbnail);
        } catch (e) {
          // Optionally log this error but don’t crash the app
          console.error("Failed to delete thumbnail:", e);
        }
      }
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
