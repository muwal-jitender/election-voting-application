import { ElectionController } from "../modules/election/election.controller";
import { Router } from "express";
import { container } from "tsyringe";

const electionRouter = Router();
const electionController = container.resolve(ElectionController);

electionRouter.post("/", electionController.create.bind(electionController));
electionRouter.get("/", electionController.get.bind(electionController));
electionRouter.get("/:id", electionController.getById.bind(electionController));
electionRouter.delete("/:id",electionController.remove.bind(electionController));
electionRouter.patch("/:id", electionController.update.bind(electionController));
electionRouter.get("/:id/candidates", electionController.getCandidatesByElectionId.bind(electionController));
electionRouter.get("/:id/voters", electionController.getVotersByElectionId.bind(electionController));

export default electionRouter;