import { Router } from "express";
import { VoterController } from "./voter.controller";
import { authenticateJWT } from "middleware/auth.middleware";
import { container } from "tsyringe";

const voterRouter = Router();
const voterController: VoterController = container.resolve(VoterController);

voterRouter.get("/me", authenticateJWT, async (req, res, next) => {
  await voterController.me(req, res, next);
});
voterRouter.get("/:id", authenticateJWT, async (req, res, next) => {
  await voterController.getById(req, res, next);
});

export default voterRouter;
