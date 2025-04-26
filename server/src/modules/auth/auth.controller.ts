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

      logger.info(`🔑 Login attempt ➔ ${signInDTO.email}`);

      // 1. Validate credentials
      const voter = await this.authService.checkCredentials(
        signInDTO.email.toLowerCase(),
        signInDTO.password
      );
      logger.info(`✅ Credentials valid ➔ ${voter.email}`);

      // 2. Generate and set access token cookie
      const accessToken = this.authService.generateAccessToken(voter);
      res.cookie(
        jwtService.accessTokenName,
        accessToken,
        jwtService.cookieOptions("AccessToken")
      );
      logger.info(`🔐 Access token issued ➔ ${voter.email}`);

      // 3. Generate refresh token
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const refreshToken = this.authService.generateRefreshToken(
        voter.id,
        voter.email,
        ipAddress,
        userAgent
      );

      // 4. Save refresh token to DB
      await this.authService.saveRefreshToken({
        userId: voter.id,
        refreshToken,
        ipAddress,
        userAgent,
        isRevoked: false,
        expiresAt: jwtService.getRefreshTokenExpiryDate(),
      });
      logger.info(`💾 Refresh token saved ➔ ${voter.email}`);

      // 5. Set refresh token cookie
      res.cookie(
        jwtService.refreshTokenName,
        refreshToken,
        jwtService.cookieOptions("RefreshToken")
      );
      logger.info(`🔁 Refresh token issued ➔ ${voter.email}`);

      // 6. Respond with user data
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
      res.clearCookie(jwtService.accessTokenName, {
        ...jwtService.cookieOptions("AccessToken"),
        maxAge: 0,
      });
      res.clearCookie(jwtService.refreshTokenName, {
        ...jwtService.cookieOptions("RefreshToken"),
        maxAge: 0,
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
