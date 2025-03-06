// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionService } from "./election.service";
import { UploadedFile } from "express-fileupload";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/cloudinary.config";
import { StatusCodes } from "http-status-codes";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import path from "path";
import { deleteFromLocal, uploadToLocal } from "../../utils/file.utils";
import { FILE_SIZE } from "../../utils/config.utils";
import { BadRequestError, NotFoundError } from "../../utils/exceptions.utils";
import { CandidateService } from "../candidate/candidate.service";
import { VoterService } from "../voter/voter.service";
import { validateMongoId } from "../../utils/utils";

@injectable()
export class ElectionController {
  constructor(
    @inject(ElectionService) private electionService: ElectionService,
    @inject(CandidateService) private candidateService: CandidateService,
    @inject(VoterService) private voterService: VoterService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: ElectionDTO = plainToClass(ElectionDTO, req.body);

      // Validate Payload
      const errors = await validate(data);
      if (errors.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.map((err) => err.constraints) });
      }

      if (!req.files || !req.files.thumbnail) {
        throw new BadRequestError("Thumbnail is required");
      }

      const file = req.files.thumbnail as UploadedFile;

      // ✅ Get file size should be less than 10MB
      if (file.size > FILE_SIZE) {
        throw new BadRequestError(
          "File too large. Please upload an image smaller than 10MB."
        );
      }

      const cloudinaryUrl = await uploadToLocal(file);

      // ✅ Upload to Cloudinary file.tempFilePath
      const thumbnailUrl = await uploadToCloudinary(cloudinaryUrl);

      const newElection = await this.electionService.create({
        ...data,
        thumbnail: thumbnailUrl ?? "", // ✅ Store Cloudinary URL
      });

      return res.status(StatusCodes.CREATED).json({
        message: "Election created successfully",
        data: newElection,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  /** Get All elections */
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const elections = await this.electionService.getAll();
      return res.status(StatusCodes.OK).json({
        message: "Found elections",
        data: elections,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const election = await this.electionService.getById(id);
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

      // ✅ Fetch voters & candidates only if they exist
      const [voters, candidates] = await Promise.all([
        election.voters.length > 0
          ? this.voterService.findByIds(
              election.voters.map((voter) => voter.toString())
            )
          : [],
        election.candidates.length > 0
          ? await this.candidateService.findByIds(
              election.candidates.map((candidate) => candidate.toString())
            )
          : [],
      ]);

      // ✅ Send optimized response
      return res.status(StatusCodes.OK).json({
        message: "Found Election",
        data: { election, voters, candidates },
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      // Delete Candidates assigned to this election
      await this.candidateService.deleteMany(id);
      const result = await this.electionService.delete(id);
      if (!result) {
        throw new NotFoundError("Election not found");
      }
      // ✅ Delete old file from Cloudinary
      if (result.thumbnail) {
        await deleteFromCloudinary(result.thumbnail);
        // ✅ Delete old file from local storage
        deleteFromLocal(result.thumbnail);
      }

      return res.status(StatusCodes.OK).json({
        message: "Election removed successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // ✅ Get election ID from params
      validateMongoId(id);

      const existingElection = await this.electionService.getById(id);

      if (!existingElection) {
        throw new BadRequestError("Election not found");
      }

      const data: ElectionDTO = plainToClass(ElectionDTO, req.body);

      // ✅ Validate Partial Update Payload
      const errors = await validate(data, { skipMissingProperties: true });
      if (errors.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.map((err) => err.constraints) });
      }

      let thumbnailUrl = existingElection.thumbnail; // ✅ Keep old thumbnail by default

      // ✅ If a new file is uploaded, process it
      if (req.files && req.files.thumbnail) {
        const file = req.files.thumbnail as UploadedFile;

        // ✅ Check file size
        if (file.size > FILE_SIZE) {
          throw new BadRequestError(
            "File too large. Please upload an image smaller than 10MB."
          );
        }

        // ✅ Upload new file to Locally
        const cloudinaryUrl = await uploadToLocal(file);
        // ✅ Upload new file to Cloudinary
        thumbnailUrl =
          (await uploadToCloudinary(cloudinaryUrl)) ?? thumbnailUrl;

        // ✅ Delete old file from Cloudinary
        if (existingElection.thumbnail) {
          await deleteFromCloudinary(existingElection.thumbnail);
        }

        // ✅ Delete old file from local storage
        deleteFromLocal(existingElection.thumbnail);
      }

      // ✅ Update the election record
      const updatedElection = await this.electionService.update(id, {
        ...data,
        thumbnail: thumbnailUrl, // ✅ Update Cloudinary URL if changed
      });

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
