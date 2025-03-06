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
import { FILE_SIZE } from "../../utils/config.utils";
import { deleteFromLocal, uploadToLocal } from "../../utils/file.utils";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/cloudinary.config";
import { ElectionService } from "../election/election.service";

@injectable()
export class CandidateController {
  constructor(
    @inject(CandidateService) private candidateService: CandidateService,
    @inject(ElectionService) private electionService: ElectionService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CandidateDTO = plainToClass(CandidateDTO, req.body);

      // Validate Payload
      const errors = await validate(data);
      if (errors.length > 0) {
        throw new BadRequestError(
          "Bad Requests",
          errors.map((err) => err.constraints)
        );
      }

      if (!req.files || !req.files.image) {
        throw new BadRequestError("Image is required");
      }

      const file = req.files.image as UploadedFile;

      // ✅ File size should be less than 10MB
      if (file.size > FILE_SIZE) {
        throw new BadRequestError(
          "Image too large. Please upload an image smaller than 10MB."
        );
      }

      const cloudinaryUrl = await uploadToLocal(file);

      // ✅ Upload to Cloudinary file.tempFilePath
      const profilePic = await uploadToCloudinary(cloudinaryUrl);

      const newCandidate = await this.candidateService.create({
        ...data,
        image: profilePic ?? "", // ✅ Store Cloudinary URL
      });

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
      if (!id) throw new BadRequestError("Candidate-id is missing");
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
      if (!id) throw new BadRequestError("Candidate-id is missing");
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
      const { id } = req.params; // ✅ Get Candidate ID from params
      if (!id) throw new BadRequestError("Candidate-id is missing");
      const { voterId, electionId } = req.body;

      if (!electionId || !electionId.trim()) {
        throw new BadRequestError("Election-id is missing");
      }

      if (!voterId || !voterId.trim()) {
        throw new BadRequestError("Voter-id is missing");
      }

      const election =
        await this.electionService.getVotersWhoAlreadyVoted(electionId);
      if (!election) {
        throw new BadRequestError("Election not found");
      }
      if (
        election.voters.length > 0 &&
        election.voters.find((id) => id.toString() === voterId)
      ) {
        throw new BadRequestError("Voter already voted");
      }
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
