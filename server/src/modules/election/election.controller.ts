import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ElectionDTO } from "./election.dto";
import { ElectionService } from "./election.service";
import { StatusCodes } from "http-status-codes";
import { AppError } from "utils/exceptions.utils";
import { CandidateService } from "modules/candidate/candidate.service";
import { VoterService } from "modules/voter/voter.service";
import { validateMongoId } from "utils/utils";
import logger from "logger"; // ✅ Winston logger
import { auditLogUtil } from "utils/audit-log.utils";
import { AuditService } from "modules/audit/audit.service";
import { AuditAction } from "modules/audit/audit.enums";
import { AccessTokenPayload } from "utils/extend-express-request.utils";

@injectable()
export class ElectionController {
  constructor(
    @inject(ElectionService) private electionService: ElectionService,
    @inject(CandidateService) private candidateService: CandidateService,
    @inject(VoterService) private voterService: VoterService,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // 📥 1. Extract election data from request body
      const data: ElectionDTO = req.body;
      logger.info("📥 [ElectionCreate] Request received", { body: data });

      // 🛠️ 2. Create new election with optional uploaded files (e.g., banners, PDFs)
      const newElection = await this.electionService.create(data, req.files);
      logger.info("✅ [ElectionCreate] Election created in DB", {
        electionId: newElection._id,
      });

      // 👤 3. Get the admin user who initiated this request (from access token payload)
      const user = req.user as AccessTokenPayload;
      logger.info("👤 [ElectionCreate] Admin initiating request", {
        adminId: user.userId,
      });

      // 📝 4. Log the audit trail for election creation by admin
      const dto = auditLogUtil.payload(
        req,
        AuditAction.ELECTION_CREATED,
        newElection, // Include full election object for traceability
        user.userId // Admin's ID who created the election
      );
      await this.auditService.logAction(dto);
      logger.info("🗒️ [AuditLog] Election creation event logged", {
        action: AuditAction.ELECTION_CREATED,
      });

      // ✅ 5. Respond to the client with the created election
      return res.status(StatusCodes.CREATED).json({
        message: "Election created successfully",
        data: newElection,
      });
    } catch (error: unknown) {
      // ❌ 6. Handle and log any errors during creation
      logger.error("❌ [ElectionCreate] Error occurred", { error });
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      // 📥 1. Extract and parse query parameters
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const order = ["asc", "desc"].includes(req.query.order as string)
        ? (req.query.order as "asc" | "desc")
        : "desc";
      const searchQuery = (req.query.search as string)?.trim() || "";

      logger.info("🔍 [ElectionGet] Fetch request received", {
        query: { page, limit, sortBy, order, searchQuery },
      });

      // 📦 2. Fetch elections from service
      const { data, totalCount } = await this.electionService.getAll({
        page,
        limit,
        sortBy,
        order,
        searchQuery,
      });

      logger.info("📦 [ElectionGet] Elections fetched", {
        count: data.length,
        totalCount,
        currentPage: page,
      });

      // ✅ 3. Respond to the client with paginated results
      return res.status(StatusCodes.OK).json({
        message: "Elections retrieved successfully",
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
        },
        data,
      });
    } catch (error) {
      // ❌ 4. Log and handle error
      logger.error("❌ [ElectionGet] Error fetching elections", { error });
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const electionId = validateMongoId(id);

      const election = await this.electionService.getById(electionId);
      if (!election) {
        logger.warn(`⚠️ Election not found ➔ ${id}`);
        throw new AppError("Election not found.", StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.OK).json({
        message: "Found Election",
        data: election,
      });
    } catch (error) {
      logger.error("❌ Error fetching election by ID", { error });
      next(error);
    }
  }

  async getDetailsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const electionId = validateMongoId(id);
      const election = await this.electionService.getById(electionId);

      if (!election) {
        logger.warn(`⚠️ Election details not found ➔ ${id}`);
        throw new AppError("Election Not Found", StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.OK).json({
        message: "Found Election",
        data: election,
      });
    } catch (error) {
      logger.error("❌ Error fetching election details", { error });
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Extract and validate election ID from route params
      const { id } = req.params;
      const electionId = validateMongoId(id);
      logger.info("🗑️ [ElectionDelete] Deletion request received", {
        electionId,
      });

      // 🗂️ 2. Perform deletion via election service
      const result = await this.electionService.delete(electionId);
      logger.info("✅ [ElectionDelete] Election removed from DB", {
        electionId: result._id,
        title: result.title,
      });

      // 👤 3. Identify the admin performing the deletion
      const user = req.user as AccessTokenPayload;
      logger.info("👤 [ElectionDelete] Request performed by admin", {
        adminId: user.userId,
      });

      // 📝 4. Save audit log for the deletion event
      const dto = auditLogUtil.payload(
        req,
        AuditAction.ELECTION_DELETED,
        {
          electionId: result._id,
          title: result.title,
        },
        user.userId
      );
      await this.auditService.logAction(dto);
      logger.info("🗒️ [AuditLog] Election deletion event logged", {
        action: AuditAction.ELECTION_DELETED,
        electionId: result._id,
      });

      // 📤 5. Send response to the client
      return res.status(StatusCodes.OK).json({
        message: "Election removed successfully",
        data: result,
      });
    } catch (error) {
      // ❌ 6. Log and handle errors
      logger.error("❌ [ElectionDelete] Error deleting election", { error });
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Extract and validate election ID
      const { id } = req.params;
      const electionId = validateMongoId(id);
      logger.info("✏️ [ElectionUpdate] Update request received", {
        electionId,
      });

      // 🛠️ 2. Perform the update operation
      const updatedElection = await this.electionService.update(
        electionId,
        req.body,
        req.files
      );
      logger.info("✅ [ElectionUpdate] Election updated in DB", {
        electionId: updatedElection._id,
        title: updatedElection.title,
      });

      // 👤 3. Get the admin performing the update
      const user = req.user as AccessTokenPayload;
      logger.info("👤 [ElectionUpdate] Request made by admin", {
        adminId: user.userId,
      });

      // 📝 4. Log audit entry for election update
      const dto = auditLogUtil.payload(
        req,
        AuditAction.ELECTION_UPDATED, // You can define this in your enum
        {
          electionId: updatedElection._id,
          updatedFields: req.body, // Optional: only include changed fields
        },
        user.userId
      );
      await this.auditService.logAction(dto);
      logger.info("🗒️ [AuditLog] Election update event logged", {
        action: AuditAction.ELECTION_UPDATED,
        electionId: updatedElection._id,
      });

      // 📤 5. Send response
      return res.status(StatusCodes.OK).json({
        message: "Election updated successfully",
        data: updatedElection,
      });
    } catch (error: unknown) {
      // ❌ 6. Error handling
      logger.error("❌ [ElectionUpdate] Error updating election", { error });
      next(error);
    }
  }

  async getCandidatesByElectionId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      logger.info("🔍 [GetCandidates] Fetching candidates for election", {
        electionId: id,
      });

      const candidates = await this.candidateService.getAllByElectionId(id);
      logger.info("✅ [GetCandidates] Candidates fetched", {
        electionId: id,
        count: candidates.length,
      });

      res.status(StatusCodes.OK).json({
        message: "Found Candidates",
        data: candidates,
      });
    } catch (error) {
      logger.error("❌ [GetCandidates] Error fetching candidates by election", {
        error,
      });
      next(error);
    }
  }

  async getElectionResult(_req: Request, res: Response, next: NextFunction) {
    try {
      // 🗳️ 1. Fetch election results
      logger.info("📊 [ElectionResult] Fetching all election results");

      const elections = await this.electionService.getElectionResults();

      logger.info("✅ [ElectionResult] Election results retrieved", {
        totalElections: Array.isArray(elections) ? elections.length : 0,
      });

      // 📤 2. Send successful response
      return res.status(StatusCodes.OK).json({
        message: "Election results fetched successfully",
        data: elections,
      });
    } catch (error) {
      // ❌ 3. Handle and log any errors
      logger.error("❌ [ElectionResult] Error fetching election results", {
        error,
      });
      next(error);
    }
  }

  async getVotersByElectionId(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Extract and validate election ID
      const { id } = req.params;
      validateMongoId(id);
      logger.info("🔍 [GetVoters] Fetching voters for election", {
        electionId: id,
      });

      // 📦 2. Fetch voters from service
      const voters = await this.voterService.getAllVotersByElectionId(id);
      logger.info("✅ [GetVoters] Voters retrieved", {
        electionId: id,
        totalVoters: Array.isArray(voters) ? voters.length : 0,
      });

      // 📤 3. Send response to client
      res.status(StatusCodes.OK).json({
        message: "Voters fetched successfully",
        data: voters,
      });
    } catch (error) {
      // ❌ 4. Handle and log error
      logger.error("❌ [GetVoters] Error fetching voters for election", {
        error,
      });
      next(error);
    }
  }

  async checkIfVoterVoted(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Validate election ID
      const { id } = req.params;
      const electionId = validateMongoId(id);
      logger.info("🔍 [CheckVoteStatus] Checking vote status for election", {
        electionId,
      });

      // 👤 2. Get voter ID from request (decoded from access token)
      const voterId = req.user?.userId;
      if (!voterId) {
        logger.warn("⚠️ [CheckVoteStatus] Voter ID not found in token");
        throw new AppError("Voter not found", StatusCodes.NOT_FOUND);
      }
      logger.info("👤 [CheckVoteStatus] Voter identified", { voterId });

      // 📦 3. Fetch election data
      const election =
        await this.electionService.getVotersWhoAlreadyVoted(electionId);
      if (!election) {
        logger.warn(`⚠️ [CheckVoteStatus] Election not found ➔ ${id}`);
        throw new AppError("Election not found", StatusCodes.NOT_FOUND);
      }

      // ✅ 4. Check if voter has voted
      const hasVoted =
        election.voters.length > 0 &&
        election.voters.some((votedId) => votedId === voterId);

      logger.info("📊 [CheckVoteStatus] Vote status determined", {
        voterId,
        electionId,
        hasVoted,
      });

      // 📝 5. Audit only if voter has voted (no candidate info stored)
      if (hasVoted) {
        const dto = auditLogUtil.payload(
          req,
          AuditAction.VOTE_CONFIRMED,
          { electionId },
          voterId
        );
        await this.auditService.logAction(dto);
        logger.info("🗒️ [AuditLog] VOTE_CONFIRMED event logged", {
          electionId,
          voterId,
        });
      }

      // 📤 6. Respond with status
      res.status(StatusCodes.OK).json({
        message: `Voter ${hasVoted ? "has already" : "has not"} voted`,
        data: { voted: hasVoted },
      });
    } catch (error) {
      // ❌ 7. Error handling
      logger.error("❌ [CheckVoteStatus] Error checking if voter has voted", {
        error,
      });
      next(error);
    }
  }
}
