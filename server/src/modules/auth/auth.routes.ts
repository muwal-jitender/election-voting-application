import { RegisterVoterDTO, SignInDTO } from "modules/voter/voter.dto";

import { AuthController } from "./auth.controller";
import { Router } from "express";
import { authenticateJWT } from "middleware/auth.middleware";
import { container } from "tsyringe";
import { validateRequest } from "middleware/validate-request.middleware";

const authRouter = Router();
const authController: AuthController = container.resolve(AuthController);

authRouter.post(
  "/register",
  validateRequest(RegisterVoterDTO),
  async (req, res, next) => {
    await authController.register(req, res, next);
  }
);
authRouter.post(
  "/login",
  validateRequest(SignInDTO),
  async (req, res, next) => {
    await authController.login(req, res, next);
  }
);

authRouter.post("/logout", authenticateJWT, async (req, res, next) => {
  await authController.logout(req, res, next);
});

export default authRouter;
