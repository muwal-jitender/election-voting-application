import { inject, singleton } from "tsyringe";
import { ElectionDTO } from "./election.dto";
import { ElectionRepository } from "./election.repository";
import mongoose from "mongoose";
import { AppError } from "utils/exceptions.utils";
import { CandidateRepository } from "modules/candidate/candidate.repository";
import { deleteFromCloudinary } from "config/cloudinary.config";
import { FileArray } from "express-fileupload";
import { deleteFile, uploadFile } from "utils/file.utils";
import { ElectionDocument } from "./election.model";
import { StatusCodes } from "http-status-codes";
import logger from "logger"; // ✅ Add Winston logger

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
      logger.info("📥 Creating new election", { title: data.title });

      const newThumbnailUrl = await uploadFile(files, "thumbnail");

      const newElection = await this.electionRepository.create({
        ...data,
        thumbnail: newThumbnailUrl,
      });

      await session.commitTransaction();
      session.endSession();

      logger.info("✅ Election created successfully", { id: newElection._id });
      return newElection;
    } catch (error) {
      logger.error("❌ Election creation failed", { error });
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
    let uploadedFileUrl: string | null = null;

    try {
      logger.info(`✏️ Updating election ➔ ${electionId}`);

      const existingElection = await this.getById(electionId);
      if (!existingElection) {
        logger.warn(`⚠️ Election not found ➔ ${electionId}`);
        throw new AppError("Election not found.", StatusCodes.NOT_FOUND);
      }

      const newThumbnailUrl = await uploadFile(
        files,
        "thumbnail",
        existingElection.thumbnail
      );
      uploadedFileUrl = newThumbnailUrl;

      const updatedElection = await this.electionRepository.update(
        electionId,
        { ...dto, thumbnail: newThumbnailUrl },
        session
      );

      if (!updatedElection) {
        logger.error(`❌ Election update failed ➔ ${electionId}`);
        throw new AppError("Election update failed.", StatusCodes.NOT_FOUND);
      }

      if (existingElection.thumbnail !== newThumbnailUrl) {
        await deleteFile(existingElection.thumbnail);
      }

      await session.commitTransaction();
      session.endSession();

      logger.info("✅ Election updated successfully", {
        id: updatedElection._id,
      });
      return updatedElection;
    } catch (error) {
      if (uploadedFileUrl) {
        await deleteFromCloudinary(uploadedFileUrl);
        logger.warn("🧹 Rolled back uploaded image due to error", {
          url: uploadedFileUrl,
        });
      }

      await session.abortTransaction();
      session.endSession();

      logger.error(`❌ Error updating election ➔ ${electionId}`, { error });
      throw error;
    }
  }

  async getById(id: string) {
    logger.info(`🔍 Fetching election by ID ➔ ${id}`);
    return await this.electionRepository.findById(id, ["voters", "candidates"]);
  }

  async getElectionResults() {
    logger.info("📊 Fetching election results");
    return await this.electionRepository.findAll2(
      {},
      ["id", "thumbnail", "title"],
      [
        {
          path: "candidates",
          select: ["fullName", "image", "motto", "voteCount"],
        },
        { path: "voters", select: ["fullName", "email", "isAdmin"] },
      ]
    );
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
    logger.info("📦 Fetching paginated elections", {
      page,
      limit,
      sortBy,
      order,
      searchQuery,
    });

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
    const session = await mongoose.startSession();
    session.startTransaction();
    let deletedElection: ElectionDocument | null = null;

    try {
      logger.info(`🗑️ Deleting election ➔ ${id}`);

      const election = await this.electionRepository.findById(id);
      if (!election) {
        logger.warn(`⚠️ Election not found ➔ ${id}`);
        throw new AppError("Election not found", StatusCodes.NOT_FOUND);
      }

      await this.candidateRepository.deleteMany({ electionId: id }, session);

      deletedElection = await this.electionRepository.delete(id, session);
      if (!deletedElection) {
        logger.error(`❌ Election deletion failed ➔ ${id}`);
        throw new AppError("Election deletion failed.", StatusCodes.NOT_FOUND);
      }

      await session.commitTransaction();
      logger.info("✅ Election deleted successfully", { id });
      return deletedElection;
    } catch (error) {
      await session.abortTransaction();
      logger.error(`❌ Error deleting election ➔ ${id}`, { error });
      throw error;
    } finally {
      session.endSession();
      if (deletedElection?.thumbnail) {
        try {
          await deleteFile(deletedElection.thumbnail);
          logger.info("🧹 Thumbnail removed from storage", {
            file: deletedElection.thumbnail,
          });
        } catch (e) {
          logger.warn("⚠️ Failed to delete thumbnail", { error: e });
        }
      }
    }
  }

  async getVotersWhoAlreadyVoted(id: string) {
    logger.info(`📋 Fetching voters who voted ➔ ${id}`);
    return await this.electionRepository.findOneByFieldWithSelect("_id", id, [
      "voters",
    ]);
  }
}
