import { RegisterVoterDTO, SignInDTO } from "./voter.dto";

import { Router } from "express";
import { VoterController } from "./voter.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { container } from "tsyringe";
import { validateRequest } from "../../middleware/validate-request.middleware";

const voterRouter = Router();
const voterController: VoterController = container.resolve(VoterController);

voterRouter.post(
  "/register",
  validateRequest(RegisterVoterDTO),
  async (req, res, next) => {
    await voterController.register(req, res, next);
  }
);
voterRouter.post(
  "/login",
  validateRequest(SignInDTO),
  async (req, res, next) => {
    await voterController.login(req, res, next);
  }
);

voterRouter.get("/:id", authenticateJWT, async (req, res, next) => {
  await voterController.getById(req, res, next);
});

export default voterRouter;
