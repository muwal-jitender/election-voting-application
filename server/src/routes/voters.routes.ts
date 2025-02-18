import { getById, login, register } from "../controllers/voters.controller";

import { Router } from "express";

const voterRouter = Router();

voterRouter.post("/login", login);
voterRouter.post("/register", register);
voterRouter.get("/:id", getById);

export default voterRouter;