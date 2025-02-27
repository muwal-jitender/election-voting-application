import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import candidateRouter from "./candidate.routes";
import electionRouter from "./elections.routes";
import { isAdmin } from "../middleware/admin.middleware";
import voterRouter from "./voter.routes";

const router = Router();
// Voters
router.use("/api/v1/voters", voterRouter);
router.use("/api/v1/elections", authenticateJWT, isAdmin, electionRouter);
router.use("/api/v1/candidates", candidateRouter);

export default router;
