// Voter Controller
import "reflect-metadata";

import { Request, Response } from "express";
import { inject, injectable, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionService } from "./election.service";
import { UploadedFile } from "express-fileupload";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { StatusCodes } from "http-status-codes";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@injectable()
export class ElectionController {
  constructor(
    @inject(ElectionService) private electionService: ElectionService
  ) {}

  async create(req: Request, res: Response) {
    try {
      const data: ElectionDTO = plainToClass(ElectionDTO, req.body);

      if (!req.files || !req.files.thumbnail) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Thumbnail is required" });
      }

      // Validate Payload
      const errors = await validate(data);
      if (errors.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.map((err) => err.constraints) });
      }

      const file = req.files.thumbnail as UploadedFile; // ✅ Get file from `req.files`

      // ✅ Upload to Cloudinary
      const thumbnailUrl = await uploadToCloudinary(file.tempFilePath);

      const newElection = await this.electionService.create({
        ...data,
        thumbnail: thumbnailUrl ?? "", // ✅ Store Cloudinary URL
      });

      return res.status(StatusCodes.CREATED).json({
        message: "Election created successfully",
        data: newElection,
      });
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).stack });
    }
  }

  async get(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
