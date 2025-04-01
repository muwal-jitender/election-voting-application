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

@injectable()
export class ElectionController {
  constructor(
    @inject(ElectionService) private electionService: ElectionService,
    @inject(CandidateService) private candidateService: CandidateService,
    @inject(VoterService) private voterService: VoterService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: ElectionDTO = req.body;
      const newElection = await this.electionService.create(data, req.files);
      return res.status(StatusCodes.CREATED).json({
        message: "Election created successfully",
        data: newElection,
      });
    } catch (error: unknown) {
      logger.error("❌ Error creating election", { error });
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const order = ["asc", "desc"].includes(req.query.order as string)
        ? (req.query.order as "asc" | "desc")
        : "desc";
      const searchQuery = (req.query.search as string)?.trim() || "";

      const { data, totalCount } = await this.electionService.getAll({
        page,
        limit,
        sortBy,
        order,
        searchQuery,
      });

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
      logger.error("❌ Error fetching elections", { error });
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);

      const election = await this.electionService.getById(id);
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
      validateMongoId(id);
      const election = await this.electionService.getById(id);

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
      const { id } = req.params;
      validateMongoId(id);
      const result = await this.electionService.delete(id);
      return res.status(StatusCodes.OK).json({
        message: "Election removed successfully",
        data: result,
      });
    } catch (error) {
      logger.error("❌ Error deleting election", { error });
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const updatedElection = await this.electionService.update(
        id,
        req.body,
        req.files
      );
      return res.status(StatusCodes.OK).json({
        message: "Election updated successfully",
        data: updatedElection,
      });
    } catch (error: unknown) {
      logger.error("❌ Error updating election", { error });
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
      const candidates = await this.candidateService.getAllByElectionId(id);
      res.status(StatusCodes.OK).json({
        message: "Found Candidates",
        data: candidates,
      });
    } catch (error) {
      logger.error("❌ Error fetching candidates by election", { error });
      next(error);
    }
  }

  async getElectionResult(_req: Request, res: Response, next: NextFunction) {
    try {
      const elections = await this.electionService.getElectionResults();
      res.status(StatusCodes.OK).json({
        message: "Found Candidates",
        data: elections,
      });
    } catch (error) {
      logger.error("❌ Error fetching election results", { error });
      next(error);
    }
  }

  async getVotersByElectionId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const voters = await this.voterService.getAllVotersByElectionId(id);
      res.status(StatusCodes.OK).json({
        message: "Found Candidates",
        data: voters,
      });
    } catch (error) {
      logger.error("❌ Error fetching voters for election", { error });
      next(error);
    }
  }

  async checkIfVoterVoted(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      let hasVoted = false;
      const voterId = req.user?.id;

      if (!voterId) {
        logger.warn("⚠️ Voter ID not found in token");
        throw new AppError("Voter not found", StatusCodes.NOT_FOUND);
      }

      const election = await this.electionService.getVotersWhoAlreadyVoted(id);
      if (!election) {
        logger.warn(`⚠️ Election not found ➔ ${id}`);
        throw new AppError("Election not found", StatusCodes.NOT_FOUND);
      }

      if (
        election.voters.length > 0 &&
        election.voters.find((id) => id.toString() === voterId)
      ) {
        hasVoted = true;
      }

      res.status(StatusCodes.OK).json({
        message: `Voter ${hasVoted ? "has already" : "has not"} voted`,
        data: { voted: hasVoted },
      });
    } catch (error) {
      logger.error("❌ Error checking if voter has voted", { error });
      next(error);
    }
  }
}
