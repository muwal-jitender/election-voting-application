import { CandidateController } from "../modules/candidate/candidate.controller";
import { Router } from "express";
import { container } from "tsyringe";

const candidateRouter = Router();
const candidateController = container.resolve(CandidateController);

candidateRouter.post("/", async (req, res, next) => {
  await candidateController.create(req, res, next);
});
candidateRouter.get("/:id", async (req, res, next) => {
  await candidateController.get(req, res, next);
});
candidateRouter.get("/:id", async (req, res, next) => {
  await candidateController.getById(req, res, next);
});
candidateRouter.delete("/:id", async (req, res, next) => {
  await candidateController.remove(req, res, next);
});
candidateRouter.patch("/:id", async (req, res, next) => {
  await candidateController.vote(req, res, next);
});

export default candidateRouter;
