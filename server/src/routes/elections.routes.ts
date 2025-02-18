import { create, get, getById, getCandidatesByElectionId, getVotersByElectionId, remove, update } from "../controllers/election.controller";

import { Router } from "express";

const electionRouter = Router();

electionRouter.post("/", create);
electionRouter.get("/", get);
electionRouter.get("/:id", getById);
electionRouter.delete("/:id", remove);
electionRouter.patch("/:id", update);
electionRouter.get("/:id/candidates", getCandidatesByElectionId);
electionRouter.get("/:id/voters", getVotersByElectionId);

export default electionRouter;