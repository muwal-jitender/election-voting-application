import { ElectionController } from "../modules/election/election.controller";
import { Router } from "express";
import { container } from "tsyringe";

const electionRouter = Router();
const electionController = container.resolve(ElectionController);

electionRouter.post("/", async (req, res) => {
  await electionController.create(req, res);
});

electionRouter.get("/", async (req, res) => {
  await electionController.get(req, res);
});
electionRouter.get("/:id", async (req, res) => {
  await electionController.getById(req, res);
});
electionRouter.delete("/:id", async (req, res) => {
  await electionController.remove(req, res);
});
electionRouter.patch("/:id", async (req, res) => {
  await electionController.update(req, res);
});
electionRouter.get("/:id/candidates", async (req, res) => {
  await electionController.getCandidatesByElectionId(req, res);
});
electionRouter.get("/:id/voters", async (req, res) => {
  await electionController.getVotersByElectionId(req, res);
});

export default electionRouter;
