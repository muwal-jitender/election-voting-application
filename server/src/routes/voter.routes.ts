import { Router } from "express";
import { VoterController } from "../modules/voter/voter.controller";
import { container } from "tsyringe";

const voterRouter = Router();
const voterController: VoterController = container.resolve(VoterController);

voterRouter.post("/register", async (req, res, next) => {
  await voterController.register(req, res, next);
});
voterRouter.post("/login", async (req, res, next) => {
  await voterController.login(req, res, next);
});

voterRouter.get("/:id", async (req, res) => {
  await voterController.getById(req, res);
});

export default voterRouter;
