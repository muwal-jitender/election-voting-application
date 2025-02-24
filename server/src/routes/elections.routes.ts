import { ElectionController } from "../modules/election/election.controller";
import { Router } from "express";
import { container } from "tsyringe";

const electionRouter = Router();
const electionController = container.resolve(ElectionController);

electionRouter.post("/", async (req, res, next) => {
  await electionController.create(req, res, next);
});

electionRouter.get("/", async (req, res, next) => {
  await electionController.get(req, res, next);
});
electionRouter.get("/:id", async (req, res, next) => {
  await electionController.getById(req, res, next);
});
electionRouter.delete("/:id", async (req, res, next) => {
  await electionController.remove(req, res, next);
});
electionRouter.patch("/:id", async (req, res, next) => {
  await electionController.update(req, res, next);
});
electionRouter.get("/:id/candidates", async (req, res, next) => {
  await electionController.getCandidatesByElectionId(req, res, next);
});
electionRouter.get("/:id/voters", async (req, res, next) => {
  await electionController.getVotersByElectionId(req, res, next);
});

export default electionRouter;
