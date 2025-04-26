import { Router } from "express";
import authRouter from "modules/auth/auth.routes";
import { authenticateJWT } from "middleware/auth.middleware";
import candidateRouter from "modules/candidate/candidate.routes";
import electionRouter from "modules/election/elections.routes";
import voterRouter from "modules/voter/voter.routes";

const router = Router();
// Voters
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/voters", voterRouter);
router.use("/api/v1/elections", authenticateJWT, electionRouter);
router.use("/api/v1/candidates", authenticateJWT, candidateRouter);

export default router;
