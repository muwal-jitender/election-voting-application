// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "./voter.dto";
import { VoterService } from "./voter.service";

import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";

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

      res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(StatusCodes.OK).json({
        message: "You are now logged in",
        data: {
          email: voter.email,
          fullName: voter.fullName,
          isAdmin: voter.isAdmin,
        },
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
  /** Get Logged-in user's detail */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const voter = await this.voterService.getUserDetail(userId);
      res.status(StatusCodes.OK).json({ message: "User found", data: voter });
    } catch (error) {
      next(error);
    }
  }
  async logout(_req: Request, res: Response, _next: NextFunction) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  }
}
