// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "./voter.dto";
import { VoterService } from "./voter.service";

import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import logger from "logger";
import { validateMongoId } from "utils/utils";

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
      logger.error("❌ Registration failed", { error });
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
        httpOnly: true, // Protects against XSS attacks
        secure: env.NODE_ENV === "production",
        sameSite: "strict", // Protects against CSRF attacks
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
      logger.error(`⚠️ Login failed ➔ ${req.body?.email}`, { error });
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const voter = await this.voterService.getVoterById(id);
      res.status(StatusCodes.OK).json({ message: "Voter found", data: voter });
    } catch (error) {
      logger.error(`❌ Error fetching voter ➔ ${req.params.id}`, { error });
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
      logger.error(`❌ Failed to fetch user profile`, { error });
      next(error);
    }
  }
  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error(`❌ Logout failed`, { error });
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "No refresh token provided." });
      }

      // Verify refresh token
      jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
        async (err, decoded: any) => {
          if (err || !decoded?.userId) {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ message: "Invalid or expired refresh token." });
          }

          // (Optional) Verify if refresh token is still valid in DB
          // const storedToken = await tokenService.findValidRefreshToken(decoded.userId, refreshToken);
          // if (!storedToken) return res.status(401).json({ message: "Token no longer valid." });

          const user = await getUserById(decoded.userId);
          if (!user) {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ message: "User no longer exists." });
          }

          // Generate new tokens
          const newAccessToken = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            env.JWT_SECRET,
            {
              expiresIn: "15m",
            }
          );

          const newRefreshToken = jwt.sign(
            { userId: user.id },
            env.JWT_REFRESH_SECRET,
            {
              expiresIn: "7d",
            }
          );

          // (Optional) Replace old refresh token in DB
          // await tokenService.updateRefreshToken(user.id, newRefreshToken);

          // Set new cookies
          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          return res
            .status(StatusCodes.OK)
            .json({ message: "Token refreshed successfully." });
        }
      );
    } catch (error) {
      logger.error("⚠️ Error refreshing token", { error });
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong." });
    }
  }
}
