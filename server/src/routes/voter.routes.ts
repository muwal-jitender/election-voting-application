import { Router } from "express";
import { VoterController } from "../modules/voter/voter.controller";
import { container } from "tsyringe";

const voterRouter = Router();
const voterController = container.resolve(VoterController);


voterRouter.post("/login", voterController.login.bind(voterController));
voterRouter.post("/register", voterController.register.bind(voterController));
voterRouter.get("/:id",voterController.getById.bind(voterController) );

export default voterRouter;