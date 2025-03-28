import { ElectionController } from "./election.controller";
import { ElectionDTO } from "./election.dto";
import { Router } from "express";
import { container } from "tsyringe";
import { isAdmin } from "middleware/admin.middleware";
import { validateRequest } from "middleware/validate-request.middleware";

const electionRouter = Router();
const electionController = container.resolve(ElectionController);

electionRouter.post(
  "/",
  isAdmin,
  validateRequest(ElectionDTO),
  async (req, res, next) => {
    await electionController.create(req, res, next);
  }
);
electionRouter.get("/elections-result", async (req, res, next) => {
  await electionController.getElectionResult(req, res, next);
});
electionRouter.get("/", isAdmin, async (req, res, next) => {
  await electionController.get(req, res, next);
});
electionRouter.get("/:id", isAdmin, async (req, res, next) => {
  await electionController.getById(req, res, next);
});
electionRouter.get("/:id/details", isAdmin, async (req, res, next) => {
  await electionController.getDetailsById(req, res, next);
});
electionRouter.delete("/:id", isAdmin, async (req, res, next) => {
  await electionController.remove(req, res, next);
});
electionRouter.patch(
  "/:id",
  validateRequest(ElectionDTO),
  isAdmin,
  async (req, res, next) => {
    await electionController.update(req, res, next);
  }
);

electionRouter.get("/:id/candidates", async (req, res, next) => {
  await electionController.getCandidatesByElectionId(req, res, next);
});
electionRouter.get("/:id/voters", async (req, res, next) => {
  await electionController.getVotersByElectionId(req, res, next);
});
electionRouter.get("/:id/voted", async (req, res, next) => {
  await electionController.checkIfVoterVoted(req, res, next);
});

export default electionRouter;
