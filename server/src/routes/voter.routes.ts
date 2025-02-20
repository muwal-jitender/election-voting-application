import { Router } from "express";
import { VoterController } from "../modules/voter/voter.controller";
import { container } from "tsyringe";

const voterRouter = Router();
const voterController:VoterController = container.resolve(VoterController);


voterRouter.post("/login", async (req, res) => { await voterController.login(req, res); });
voterRouter.post("/register", async (req, res) => { await voterController.register(req, res); });
voterRouter.get("/:id", async (req, res) => { await voterController.getById(req, res); });

export default voterRouter;