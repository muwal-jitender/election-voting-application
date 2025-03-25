// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { CandidateDTO } from "./candidate.dto";
import { CandidateService } from "./candidate.service";

import { StatusCodes } from "http-status-codes";

import { validateMongoId } from "utils/utils";

@injectable()
export class CandidateController {
  constructor(
    @inject(CandidateService) private candidateService: CandidateService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CandidateDTO = req.body;

      const newCandidate = await this.candidateService.create(
        data,
        req.files // ✅ Store Cloudinary URL
      );

      return res.status(StatusCodes.CREATED).json({
        message: "Candidate added successfully",
        data: newCandidate,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  async get(_: Request, res: Response, next: NextFunction) {
    try {
      const candidates = await this.candidateService.getAll();
      return res
        .status(StatusCodes.OK)
        .json({ message: "Found Candidate", data: candidates });
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const candidate = await this.candidateService.getById(id);
      return res
        .status(StatusCodes.OK)
        .json({ message: "Found candidate", data: candidate });
    } catch (error) {
      next(error);
    }
  }
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);

      // Delete Candidates assigned to this election
      const result = await this.candidateService.delete(id);
      return res.status(StatusCodes.OK).json({
        message: "Candidate removed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**Allow voters to cast their votes */
  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { electionId } = req.params;
      const voterId = req.user?.id as string;
      validateMongoId(voterId);
      validateMongoId(electionId);

      // ✅ Update the election record
      await this.candidateService.voteCandidate(id, voterId, electionId);

      return res.status(StatusCodes.OK).json({
        message: "Vote casted successfully",
        data: null,
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
  async getCandidatesByElectionId(_req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Get voters by election id
   * @param req
   * @param res
   */
  async getVotersByElectionId(_req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
