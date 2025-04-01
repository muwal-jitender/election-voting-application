import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { CandidateDTO } from "./candidate.dto";
import { CandidateService } from "./candidate.service";

import { StatusCodes } from "http-status-codes";
import { validateMongoId } from "utils/utils";
import logger from "logger"; // ✅ Winston logger

@injectable()
export class CandidateController {
  constructor(
    @inject(CandidateService) private candidateService: CandidateService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CandidateDTO = req.body;
      logger.info(`🧾 Creating new candidate: ${data.fullName}`);

      const newCandidate = await this.candidateService.create(data, req.files);

      logger.info(`✅ Candidate created: ${newCandidate.id}`);
      return res.status(StatusCodes.CREATED).json({
        message: "Candidate added successfully",
        data: newCandidate,
      });
    } catch (error: unknown) {
      logger.error("❌ Error creating candidate", { error });
      next(error);
    }
  }

  async get(_: Request, res: Response, next: NextFunction) {
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
      validateMongoId(id);
      logger.info(`🔍 Getting candidate by ID: ${id}`);

      const candidate = await this.candidateService.getById(id);
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
      const { id } = req.params;
      validateMongoId(id);
      logger.info(`🗑️ Deleting candidate: ${id}`);

      await this.candidateService.delete(id);
      logger.info(`✅ Candidate deleted: ${id}`);

      return res.status(StatusCodes.OK).json({
        message: "Candidate removed successfully",
        data: null,
      });
    } catch (error) {
      logger.error(`❌ Failed to delete candidate ➔ ${req.params.id}`, {
        error,
      });
      next(error);
    }
  }

  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, electionId } = req.params;
      const voterId = req.user?.id as string;

      validateMongoId(id);
      validateMongoId(voterId);
      validateMongoId(electionId);

      logger.info(
        `🗳️ Casting vote ➔ candidate: ${id}, voter: ${voterId}, election: ${electionId}`
      );
      await this.candidateService.voteCandidate(id, voterId, electionId);

      return res.status(StatusCodes.OK).json({
        message: "Vote casted successfully",
        data: null,
      });
    } catch (error: unknown) {
      logger.error("❌ Vote casting failed", { error });
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
