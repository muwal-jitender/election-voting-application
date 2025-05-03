// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { VoterService } from "./voter.service";
import { StatusCodes } from "http-status-codes";
import logger from "logger";
import { validateMongoId } from "utils/utils";
import { AccessTokenPayload } from "utils/extend-express-request.utils";

@injectable()
export class VoterController {
  constructor(@inject(VoterService) private voterService: VoterService) {}

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const voterId = validateMongoId(id);
      const voter = await this.voterService.getVoterById(voterId);
      res.status(StatusCodes.OK).json({ message: "Voter found", data: voter });
    } catch (error) {
      logger.error(`❌ Error fetching voter ➔ ${req.params.id}`, { error });
      next(error);
    }
  }
  /** Get Logged-in user's detail */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as AccessTokenPayload).userId;

      const voter = await this.voterService.getVoterById(userId);
      res.status(StatusCodes.OK).json({ message: "User found", data: voter });
    } catch (error) {
      logger.error(`❌ Failed to fetch user profile`, { error });
      next(error);
    }
  }
}
