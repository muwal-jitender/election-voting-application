import { RegisterVoterDTO, SignInDTO } from "modules/voter/voter.dto";

import { AuthController } from "./auth.controller";
import { Router } from "express";
import { attachRefreshToken } from "middleware/attach-RefreshToken.middleware";
import { container } from "tsyringe";
import { rateLimiter } from "middleware/rateLimiter.middleware";
import { validateRequest } from "middleware/validate-request.middleware";

const authRouter = Router();
const authController: AuthController = container.resolve(AuthController);

authRouter.post(
  "/register",
  validateRequest(RegisterVoterDTO),
  rateLimiter(),
  async (req, res, next) => {
    await authController.register(req, res, next);
  }
);
authRouter.post(
  "/login",
  validateRequest(SignInDTO),
  rateLimiter({
    max: 5,
    windowMs: 5 * 60 * 1000,
    message: "⚠️ Too many login attempts. Please wait 5 minutes.",
  }),
  async (req, res, next) => {
    await authController.login(req, res, next);
  }
);
authRouter.post(
  "/refresh-token",
  attachRefreshToken,
  rateLimiter(),
  async (req, res, next) => {
    await authController.refreshToken(req, res, next);
  }
);

authRouter.post("/logout", rateLimiter(), async (req, res, next) => {
  await authController.logout(req, res, next);
});
authRouter.post(
  "/logout-all-devices",
  rateLimiter(),
  async (req, res, next) => {
    await authController.logoutAllDevices(req, res, next);
  }
);

export default authRouter;
