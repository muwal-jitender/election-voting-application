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
      const voterData: RegisterVoterDTO = plainToClass(
        RegisterVoterDTO,
        req.body
      );

      // Validate Payload
      const errors = await validate(voterData);
      if (errors.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.map((err) => err.constraints) });
      }

      // Checking if email already exists
      const emailExists = await this.voterService.findByEmail(voterData.email);
      if (emailExists) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: "Email already exists" });
      }

      // Explicitly set isAdmin to false
      const voter = await this.voterService.registerVoter({
        ...voterData,
        isAdmin: false,
      });

      // Remove sensitive fields
      // const { password, ...safeVoterData } = voter.toObject();

      return res.status(StatusCodes.CREATED).json({
        message: "Voter registered successfully",
        data: voter,
      });
    } catch (error: unknown) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).stack });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const signInDTO: SignInDTO = plainToClass(SignInDTO, req.body);
      // Validate Payload
      const errors = await validate(signInDTO);
      if (errors.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.map((err) => err.constraints) });
      }
      const voter = await this.voterService.checkCredentials(
        signInDTO.email.toLowerCase(),
        signInDTO.password
      );
      if (!voter) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid username or password",
          data: null,
        });
      }
      return res
        .status(StatusCodes.OK)
        .json({ message: "You are now logged in", data: null });
    } catch (error: unknown) {
      return res.status(500).json({ message: (error as Error).stack });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const voters = await this.voterService.getAllVoters();
      res.status(200).json({ message: "Voter found", data: voters });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
