import { CandidateController } from "./candidate.controller";
import { CandidateDTO } from "./candidate.dto";
import { Router } from "express";
import { authenticateJWT } from "middleware/auth.middleware";
import { container } from "tsyringe";
import { isAdmin } from "middleware/admin.middleware";
import { validateRequest } from "middleware/validate-request.middleware";

const candidateRouter = Router();
const candidateController = container.resolve(CandidateController);

candidateRouter.post(
  "/",
  isAdmin,
  validateRequest(CandidateDTO),
  async (req, res, next) => {
    await candidateController.create(req, res, next);
  }
);
candidateRouter.get("/:id", isAdmin, async (req, res, next) => {
  await candidateController.get(req, res, next);
});
candidateRouter.get("/:id", isAdmin, async (req, res, next) => {
  await candidateController.getById(req, res, next);
});
candidateRouter.delete("/:id", isAdmin, async (req, res, next) => {
  await candidateController.remove(req, res, next);
});
candidateRouter.patch(
  "/:id/elections/:electionId",
  authenticateJWT,
  async (req, res, next) => {
    await candidateController.vote(req, res, next);
  }
);

export default candidateRouter;
