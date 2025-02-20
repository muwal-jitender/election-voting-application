// Voter Controller
import "reflect-metadata";

import { Request, Response } from "express";
import { inject, injectable, singleton } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "./voter.dto";
import { VoterService } from "./voter.service";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

@injectable()
export class VoterController {
  constructor(@inject(VoterService) private voterService: VoterService) {}


  async register(req: Request, res: Response): Promise<Response> {
    try {
      const voterData: RegisterVoterDTO = plainToClass(RegisterVoterDTO, req.body);

      // Validate Payload
      const errors = await validate(voterData);
      if (errors.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.map(err => err.constraints) });
      }

      // Checking if email already exists
      const emailExists = await this.voterService.findByEmail(voterData.email);
      if (emailExists) {
        return res.status(StatusCodes.CONFLICT).json({ error: "Email already exists" });
      }

      // Explicitly set isAdmin to false
      const voter = await this.voterService.registerVoter({ ...voterData, isAdmin: false });

      // Remove sensitive fields
      const { password, ...safeVoterData } = voter.toObject();

      return res.status(StatusCodes.CREATED).json({
        message: "Voter registered successfully",
        data: safeVoterData
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  }


  async login(req: Request, res: Response) {
    try {
      const {email, password}: SignInDTO = req.body;
      const voter = await this.voterService.checkCredentials(email, password);
     return res.status(201).json(voter);
    } catch (error) {
    return  res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const voters = await this.voterService.getAllVoters();
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}