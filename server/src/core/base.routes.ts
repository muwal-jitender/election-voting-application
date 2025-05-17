import { Router } from "express";
import authRouter from "modules/auth/auth.routes";
import { authenticateJWT } from "middleware/auth.middleware";
import candidateRouter from "modules/candidate/candidate.routes";
import electionRouter from "modules/election/elections.routes";
import { rateLimiter } from "middleware/rateLimiter.middleware";
import voterRouter from "modules/voter/voter.routes";
const router = Router();
// Voters
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/voters", authenticateJWT, rateLimiter(), voterRouter);
router.use("/api/v1/elections", authenticateJWT, rateLimiter(), electionRouter);
router.use(
  "/api/v1/candidates",
  authenticateJWT,
  rateLimiter(),
  candidateRouter
);

export default router;
