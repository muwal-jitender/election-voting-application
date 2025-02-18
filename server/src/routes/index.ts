import { Router } from "express";
import electionRouter from "./elections.routes";
import voterRouter from "./voters.routes";

const router = Router();
// Voters
router.use("/api/v1/voters", voterRouter);
router.use("/api/v1/elections", electionRouter);

// Election
//router.use("/api/v1/elections", create);

export default router;
