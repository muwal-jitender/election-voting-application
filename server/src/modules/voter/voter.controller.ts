// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable, singleton } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "./voter.dto";
import { VoterService } from "./voter.service";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../utils/exceptions.utils";

@injectable()
export class VoterController {
  constructor(@inject(VoterService) private voterService: VoterService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const voterData: RegisterVoterDTO = plainToClass(
        RegisterVoterDTO,
        req.body
      );

      // Validate Payload
      const errors = await validate(voterData);
      if (errors.length > 0) {
        throw new BadRequestError(
          "Bad Requests",
          errors.map((err) => err.constraints)
        );
      }

      // Checking if email already exists
      const emailExists = await this.voterService.findByEmail(voterData.email);
      if (emailExists) {
        throw new ConflictError(
          "Email already exists",
          errors.map((err) => err.constraints)
        );
      }

      // Explicitly set isAdmin to false, so that no external voter can set itself as Admin
      const voter = await this.voterService.registerVoter({
        ...voterData,
        isAdmin: false,
      });

      // Remove sensitive fields
      // const { password, ...safeVoterData } = voter.toObject();

      return res.status(StatusCodes.CREATED).json({
        message: "Voter registered successfully",
        data: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const signInDTO: SignInDTO = plainToClass(SignInDTO, req.body);
      // Validate Payload
      const errors = await validate(signInDTO);

      if (errors.length > 0) {
        throw new BadRequestError(
          "Bad Requests",
          errors.map((err) => err.constraints)
        );
      }

      const voter = await this.voterService.checkCredentials(
        signInDTO.email.toLowerCase(),
        signInDTO.password
      );

      if (!voter) {
        throw new UnauthorizedError("Invalid username or password");
      }
      const token = this.voterService.generateToken(voter);
      const { password, ...response } = voter.toJSON(); // .toJSON() converts `_id` to `id`
      return res.status(StatusCodes.OK).json({
        message: "You are now logged in",
        data: { token, response },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const voters = await this.voterService.getVoterById(id);
      res.status(200).json({ message: "Voter found", data: voters });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
