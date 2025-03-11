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
      // ✅ Register Voter
      const voterData: RegisterVoterDTO = req.body;
      const voter = await this.voterService.registerVoter(voterData);

      // ✅ Remove password before returning the new created voter
      const { password, ...safeNewVoter } = voter.toJSON();
      return res.status(StatusCodes.CREATED).json({
        message: "Voter registered successfully",
        data: safeNewVoter,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const signInDTO: SignInDTO = req.body;

      const voter = await this.voterService.checkCredentials(
        signInDTO.email.toLowerCase(),
        signInDTO.password
      );

      const token = this.voterService.generateToken(voter);

      return res.status(StatusCodes.OK).json({
        message: "You are now logged in",
        data: { token },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const voter = await this.voterService.getVoterById(id);
      res.status(StatusCodes.OK).json({ message: "Voter found", data: voter });
    } catch (error) {
      next(error);
    }
  }
}
