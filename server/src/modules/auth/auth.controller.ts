// Voter Controller
import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { RegisterVoterDTO, SignInDTO } from "modules/voter/voter.dto";
import { AuthService } from "modules/auth/auth.service";

import { StatusCodes } from "http-status-codes";
import { env } from "utils/env-config.utils";
import logger from "logger";

import { jwtService } from "utils/jwt.utils";
import { AppError } from "utils/exceptions.utils";
import { VoterService } from "modules/voter/voter.service";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(VoterService) private voterService: VoterService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Register Voter
      const voterData: RegisterVoterDTO = req.body;
      const voter = await this.authService.registerVoter(voterData);

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

      const voter = await this.authService.checkCredentials(
        signInDTO.email.toLowerCase(),
        signInDTO.password
      );

      const accessToken = this.authService.generateAccessToken(voter);

      res.cookie(
        "access-token",
        accessToken,
        jwtService.cookieOptions("AccessToken")
      );

      // Generate refresh token and set it in the cookie
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];
      //this.authService.saveRefreshToken({
      const refreshToken = this.authService.generateRefreshToken(
        voter.id,
        voter.email,
        ipAddress,
        userAgent
      );
      res.cookie(
        "refresh-token",
        refreshToken,
        jwtService.cookieOptions("RefreshToken")
      );

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
        throw new AppError(
          "No refresh token provided.",
          StatusCodes.UNAUTHORIZED
        );
      }

      // Verify refresh token
      const jwtPayload = jwtService.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      );

      // (Optional) Verify if refresh token is still valid in DB
      // const storedToken = await tokenService.findValidRefreshToken(decoded.userId, refreshToken);
      // if (!storedToken) return res.status(401).json({ message: "Token no longer valid." });

      const user = await this.voterService.getVoterById(jwtPayload.id);
      if (!user) {
        throw new AppError("User no longer exists.", StatusCodes.UNAUTHORIZED);
      }

      // Generate new tokens
      const newAccessToken = jwtService.signin(
        { userId: user.id, isAdmin: user.isAdmin },
        env.JWT_ACCESS_SECRET,
        "AccessToken"
      );

      const newRefreshToken = jwtService.signin(
        { userId: user.id },
        env.JWT_REFRESH_SECRET,
        "RefreshToken"
      );

      // (Optional) Replace old refresh token in DB
      // await tokenService.updateRefreshToken(user.id, newRefreshToken);

      // Set new cookies
      res.cookie(
        "access_token",
        newAccessToken,
        jwtService.cookieOptions("AccessToken")
      );

      res.cookie(
        "refresh_token",
        newRefreshToken,
        jwtService.cookieOptions("RefreshToken")
      );

      return res
        .status(StatusCodes.OK)
        .json({ message: "Token refreshed successfully." });
    } catch (error) {
      logger.error("⚠️ Error refreshing token", { error });
      next(error);
    }
  }
}
