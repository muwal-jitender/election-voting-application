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

@injectable()
export class CandidateController {
  constructor(
    @inject(CandidateService) private candidateService: CandidateService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CandidateDTO = plainToClass(CandidateDTO, req.body);

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
      const elections = await this.candidateService.getAll();
      return res.status(StatusCodes.OK).json(elections);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Election-id is missing");
      const elections = await this.candidateService.getById(id);
      return res
        .status(StatusCodes.OK)
        .json({ message: "Found Election", data: elections });
    } catch (error) {
      next(error);
    }
  }
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Candidate-id is missing");
      // Delete Candidates assigned to this election
      await this.candidateService.deleteMany(id);
      const result = await this.candidateService.delete(id);
      if (!result) {
        throw new NotFoundError("Election not found");
      }
      // ✅ Delete old file from Cloudinary
      if (result.image) {
        await deleteFromCloudinary(result.image);
        // ✅ Delete old file from local storage
        deleteFromLocal(result.image);
      }

      return res.status(StatusCodes.OK).json({
        message: "Candidate removed successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // ✅ Get Candidate ID from params
      const existingElection = await this.candidateService.getById(id);

      if (!existingElection) {
        throw new BadRequestError("Candidate not found");
      }

      const data: CandidateDTO = plainToClass(CandidateDTO, req.body);

      // ✅ Validate Partial Update Payload
      const errors = await validate(data, { skipMissingProperties: true });
      if (errors.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.map((err) => err.constraints) });
      }

      let image = existingElection.image; // ✅ Keep old thumbnail by default

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
        image = (await uploadToCloudinary(cloudinaryUrl)) ?? image;

        // ✅ Delete old file from Cloudinary
        if (existingElection.image) {
          await deleteFromCloudinary(existingElection.image);
        }

        // ✅ Delete old file from local storage
        deleteFromLocal(existingElection.image);
      }

      // ✅ Update the election record
      const updatedElection = await this.candidateService.update(id, {
        ...data,
        image: image, // ✅ Update Cloudinary URL if changed
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
