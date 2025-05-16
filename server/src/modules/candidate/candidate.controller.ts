import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { CandidateDTO } from "./candidate.dto";
import { CandidateService } from "./candidate.service";

import { StatusCodes } from "http-status-codes";
import { validateMongoId } from "utils/utils";
import logger from "logger"; // ✅ Winston logger
import { AccessTokenPayload } from "utils/extend-express-request.utils";
import { AuditAction } from "modules/audit/audit.enums";
import { auditLogUtil } from "utils/audit-log.utils";
import { AuditService } from "modules/audit/audit.service";

@injectable()
export class CandidateController {
  constructor(
    @inject(CandidateService) private candidateService: CandidateService,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // 📥 1. Extract candidate data from request
      const data: CandidateDTO = req.body;
      logger.info("🧾 [CandidateCreate] Creating new candidate", {
        fullName: data.fullName,
        electionId: data.electionId,
      });

      // 🛠️ 2. Create candidate via service layer
      const newCandidate = await this.candidateService.create(data, req.files);
      logger.info("✅ [CandidateCreate] Candidate created", {
        candidateId: newCandidate.id,
        electionId: newCandidate.electionId,
      });

      // 👤 3. Identify admin performing the creation
      const user = req.user as AccessTokenPayload;
      logger.info("👤 [CandidateCreate] Admin creating candidate", {
        adminId: user.userId,
      });

      // 📝 4. Log audit event for candidate creation
      const dto = auditLogUtil.payload(
        req,
        AuditAction.CANDIDATE_CREATED,
        {
          candidateId: newCandidate.id,
          fullName: newCandidate.fullName,
          electionId: newCandidate.electionId,
        },
        user.userId
      );
      await this.auditService.logAction(dto);
      logger.info("🗒️ [AuditLog] Candidate creation logged", {
        candidateId: newCandidate.id,
      });

      // 📤 5. Respond to client
      return res.status(StatusCodes.CREATED).json({
        message: "Candidate added successfully",
        data: newCandidate,
      });
    } catch (error: unknown) {
      // ❌ 6. Error handling
      logger.error("❌ [CandidateCreate] Error creating candidate", { error });
      next(error);
    }
  }

  async get(_req: Request, res: Response, next: NextFunction) {
    try {
      const candidates = await this.candidateService.getAll();
      logger.info(`📦 Retrieved all candidates: ${candidates.length}`);
      return res
        .status(StatusCodes.OK)
        .json({ message: "Found Candidates", data: candidates });
    } catch (error) {
      logger.error("❌ Failed to get candidates", { error });
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const candidateId = validateMongoId(id);
      logger.info(`🔍 Getting candidate by ID: ${id}`);

      const candidate = await this.candidateService.getById(candidateId);
      return res
        .status(StatusCodes.OK)
        .json({ message: "Found candidate", data: candidate });
    } catch (error) {
      logger.error(`❌ Failed to get candidate ➔ ${req.params.id}`, { error });
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Validate and extract candidate ID
      const { id } = req.params;
      const candidateId = validateMongoId(id);
      logger.info("🗑️ [CandidateDelete] Deletion request received", {
        candidateId,
      });

      // 🗂️ 2. Perform the deletion
      const deletedCandidate = await this.candidateService.delete(candidateId);
      logger.info("✅ [CandidateDelete] Candidate deleted", {
        candidateId,
        fullName: deletedCandidate.fullName,
        electionId: deletedCandidate.electionId,
      });

      // 👤 3. Identify the admin performing the action
      const user = req.user as AccessTokenPayload;
      logger.info("👤 [CandidateDelete] Admin performing delete", {
        adminId: user.userId,
      });

      // 📝 4. Record audit log
      const dto = auditLogUtil.payload(
        req,
        AuditAction.CANDIDATE_DELETED,
        {
          candidateId: deletedCandidate.id,
          fullName: deletedCandidate.fullName,
          electionId: deletedCandidate.electionId,
        },
        user.userId
      );
      await this.auditService.logAction(dto);
      logger.info("🗒️ [AuditLog] Candidate deletion event logged", {
        candidateId,
      });

      // 📤 5. Respond to client
      return res.status(StatusCodes.OK).json({
        message: "Candidate removed successfully",
        data: null,
      });
    } catch (error) {
      // ❌ 6. Error handling
      logger.error(
        `❌ [CandidateDelete] Failed to delete candidate ➔ ${req.params.id}`,
        {
          error,
        }
      );
      next(error);
    }
  }

  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Extract and validate route params
      const { id, electionId } = req.params;
      const candidateId = validateMongoId(id);
      const electionMongoId = validateMongoId(electionId);

      // 👤 2. Extract voter ID from access token
      const voterId = (req.user as AccessTokenPayload).userId;

      // 📝 3. Log voting intent (normal logging, not audit yet)
      logger.info("🗳️ [Vote] Casting vote", {
        candidateId,
        electionId: electionMongoId,
        voterId,
      });

      // 🛠️ 4. Perform the vote operation
      await this.candidateService.voteCandidate(
        candidateId,
        voterId,
        electionMongoId
      );

      // 🗒️ 5. Save audit log entry (vote action — no candidate info logged)
      const dto = auditLogUtil.payload(
        req,
        AuditAction.VOTE_CAST,
        { electionId: electionMongoId }, // 🔐 no candidateId to preserve vote secrecy
        voterId
      );
      await this.auditService.logAction(dto);
      logger.info("🗒️ [AuditLog] Vote cast event logged", {
        voterId,
        electionId: electionMongoId,
      });

      // 📤 6. Send success response
      return res.status(StatusCodes.OK).json({
        message: "Vote casted successfully",
        data: null,
      });
    } catch (error: unknown) {
      // ❌ 7. Handle and log error
      logger.error("❌ [Vote] Vote casting failed", { error });
      next(error);
    }
  }

  async getCandidatesByElectionId(_req: Request, res: Response) {
    try {
      logger.info("⚙️ Called getCandidatesByElectionId placeholder");
      res.status(200).json({ message: "Get Candidates successful" });
    } catch (error) {
      logger.error("❌ Internal server error ➔ getCandidatesByElectionId", {
        error,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getVotersByElectionId(_req: Request, res: Response) {
    try {
      logger.info("⚙️ Called getVotersByElectionId placeholder");
      res.status(200).json({ message: "Get Voters successful" });
    } catch (error) {
      logger.error("❌ Internal server error ➔ getVotersByElectionId", {
        error,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
