import { create, get, remove, update } from "../controllers/candidate.controller";

import { Router } from "express";

const candidateRouter = Router();

candidateRouter.post("/", create);
candidateRouter.get("/:id", get);
candidateRouter.delete("/:id", remove);
candidateRouter.patch("/:id", update);

export default candidateRouter;