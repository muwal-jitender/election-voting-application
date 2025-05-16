// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { VoterService } from "./voter.service";
import { StatusCodes } from "http-status-codes";
import logger from "logger";
import { validateMongoId } from "utils/utils";
import { AccessTokenPayload } from "utils/extend-express-request.utils";
import { AppError } from "utils/exceptions.utils";

@injectable()
export class VoterController {
  constructor(@inject(VoterService) private voterService: VoterService) {}

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // 🆔 1. Validate voter ID from request parameters
      const { id } = req.params;
      const voterId = validateMongoId(id);
      logger.info("🔍 [VoterGet] Fetching voter by ID", { voterId });

      // 📦 2. Fetch voter from service
      const voter = await this.voterService.getVoterById(voterId);

      if (!voter) {
        logger.warn(`⚠️ [VoterGet] Voter not found ➔ ${voterId}`);
        throw new AppError("Voter not found", StatusCodes.NOT_FOUND);
      }

      logger.info("✅ [VoterGet] Voter found", {
        voterId: voter._id,
        email: voter.email,
      });

      // 📤 3. Respond to client
      res.status(StatusCodes.OK).json({
        message: "Voter found",
        data: voter,
      });
    } catch (error) {
      // ❌ 4. Error handling
      logger.error(`❌ [VoterGet] Error fetching voter ➔ ${req.params.id}`, {
        error,
      });
      next(error);
    }
  }

  /** Get Logged-in user's detail */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // 👤 1. Extract user ID from access token
      const userId = (req.user as AccessTokenPayload).userId;
      logger.info("🔍 [VoterMe] Fetching profile for current user", { userId });

      // 📦 2. Fetch voter info from service
      const voter = await this.voterService.getVoterById(userId);

      if (!voter) {
        logger.warn(`⚠️ [VoterMe] Voter profile not found ➔ ${userId}`);
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }

      logger.info("✅ [VoterMe] User profile retrieved", {
        voterId: voter._id,
        email: voter.email,
      });

      // 📤 3. Respond to client
      res.status(StatusCodes.OK).json({
        message: "User found",
        data: voter,
      });
    } catch (error) {
      // ❌ 4. Handle and log error
      logger.error("❌ [VoterMe] Failed to fetch user profile", { error });
      next(error);
    }
  }
}
