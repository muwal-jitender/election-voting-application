import { Router } from "express";
import candidateRouter from "./candidate.routes";
import electionRouter from "./elections.routes";
import voterRouter from "./voter.routes";

const router = Router();
// Voters
router.use("/api/v1/voters", voterRouter);
router.use("/api/v1/elections", electionRouter);
router.use("/api/v1/candidates", candidateRouter);

export default router;
