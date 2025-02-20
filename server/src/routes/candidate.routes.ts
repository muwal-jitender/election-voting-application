import { CandidateController } from "../modules/candidate/candidate.controller";
import { Router } from "express";
import { container } from "tsyringe";

const candidateRouter = Router();
const candidateController = container.resolve(CandidateController);

candidateRouter.post("/",candidateController.create.bind(candidateController));
candidateRouter.get("/:id",candidateController.get.bind(candidateController));
candidateRouter.delete("/:id",candidateController.remove.bind(candidateController));
candidateRouter.patch("/:id",candidateController.update.bind(candidateController));

export default candidateRouter;