import { Router } from "express";
import voterRouter from "./voters.routes";

const router = Router();

router.use("/api/v1/voters", voterRouter);

export default router;
