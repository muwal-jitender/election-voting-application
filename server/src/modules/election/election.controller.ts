// Election Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionService } from "./election.service";

import { StatusCodes } from "http-status-codes";

import { NotFoundError } from "utils/exceptions.utils";
import { CandidateService } from "modules/candidate/candidate.service";
import { VoterService } from "modules/voter/voter.service";
import { validateMongoId } from "utils/utils";

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

      // ✅ Create the election in DB
      const newElection = await this.electionService.create(data, req.files);

      return res.status(StatusCodes.CREATED).json({
        message: "Election created successfully",
        data: newElection,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * ✅ Get all elections with pagination, sorting, and optional filtering.
   * Supports query parameters: page, limit, sortBy, order, search.
   * @param req GET /api/v1/elections?page=2&limit=5&sortBy=title&order=asc
   * @param res
   * @param next
   * @returns
   */
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Extract query parameters with defaults
      const page = Number(req.query.page) || 1; // Default to page 1
      const limit = Number(req.query.limit) || 10; // Default limit to 10 per page
      const sortBy = (req.query.sortBy as string) || "createdAt"; // Default sorting field

      // ✅ Ensure `order` is either "asc" or "desc" (default: "desc")
      const order = ["asc", "desc"].includes(req.query.order as string)
        ? (req.query.order as "asc" | "desc")
        : "desc"; // Sorting order

      const searchQuery = (req.query.search as string)?.trim() || ""; // Search keyword

      // ✅ Fetch elections with pagination & filtering
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
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // ✅ Validate if ID is missing or bit a valid MongoDB ObjectId
      validateMongoId(id);

      const election = await this.electionService.getById(id);
      if (!election) {
        throw new NotFoundError("Election not found.");
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: "Found Election", data: election });
    } catch (error) {
      next(error);
    }
  }

  /** Get the Election along with its voters and candidates details */
  async getDetailsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      validateMongoId(id);

      // ✅ Fetch election, voters, and candidates in parallel for better performance
      const electionPromise = this.electionService.getById(id);
      const election = await electionPromise;

      if (!election) {
        throw new NotFoundError("Election Not Found");
      }

      // ✅ Send optimized response
      return res.status(StatusCodes.OK).json({
        message: "Found Election",
        data: election,
      });
    } catch (error) {
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
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // ✅ Get election ID from params
      validateMongoId(id);

      // ✅ Update the election record
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
      next(error);
    }
  }

  /**
   * Get candidates by election id
   * @param req
   * @param res
   */
  async getCandidatesByElectionId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const candidates = await this.candidateService.getAllByElectionId(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Found Candidates", data: candidates });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get candidates by election id
   * @param req
   * @param res
   */
  async getElectionResult(_req: Request, res: Response, next: NextFunction) {
    try {
      const elections = await this.electionService.getElectionResults();
      res
        .status(StatusCodes.OK)
        .json({ message: "Found Candidates", data: elections });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get voters by election id
   * @param req
   * @param res
   */
  async getVotersByElectionId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const voters = await this.voterService.getAllVotersByElectionId(id);
      res
        .status(StatusCodes.OK)
        .json({ message: "Found Candidates", data: voters });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Check if voter has already voted in Election or not
   * @param req
   * @param res
   */
  async checkIfVoterVoted(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      let hasVoted = false;
      const voterId = req.user?.id;
      if (!voterId) {
        throw new NotFoundError("Voter not found");
      }
      const election = await this.electionService.getVotersWhoAlreadyVoted(id);
      if (!election) {
        throw new NotFoundError("Election not found");
      }
      if (
        election.voters.length > 0 &&
        election.voters.find((id) => id.toString() === voterId)
      ) {
        hasVoted = true;
      }

      res.status(StatusCodes.OK).json({
        message: `Voter has ${hasVoted ? "has already" : "not"} voted`,
        data: { voted: hasVoted },
      });
    } catch (error) {
      next(error);
    }
  }
}
