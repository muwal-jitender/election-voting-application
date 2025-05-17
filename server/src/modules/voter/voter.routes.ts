import { Router } from "express";
import { VoterController } from "./voter.controller";
import { container } from "tsyringe";

const voterRouter = Router();
const voterController: VoterController = container.resolve(VoterController);

voterRouter.get("/me", async (req, res, next) => {
  await voterController.me(req, res, next);
});
voterRouter.get("/:id", async (req, res, next) => {
  await voterController.getById(req, res, next);
});

export default voterRouter;
