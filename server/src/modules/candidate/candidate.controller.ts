// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { CandidateDTO } from "./candidate.dto";
import { CandidateService } from "./candidate.service";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../../utils/exceptions.utils";
import { UploadedFile } from "express-fileupload";

import { deleteFromLocal, uploadToLocal } from "../../utils/file.utils";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/cloudinary.config";
import { ElectionService } from "../election/election.service";
import { validateMongoId } from "../../utils/utils";

@injectable()
export class CandidateController {
  constructor(
    @inject(CandidateService) private candidateService: CandidateService,
    @inject(ElectionService) private electionService: ElectionService
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
  async get(req: Request, res: Response, next: NextFunction) {
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
        data: null,
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
      validateMongoId(id);
      validateMongoId(electionId);

      // ✅ Update the election record
      await this.candidateService.voteCandidate(
        id,
        req.user?.id as string,
        electionId
      );

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
  async getCandidatesByElectionId(req: Request, res: Response) {
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
  async getVotersByElectionId(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
