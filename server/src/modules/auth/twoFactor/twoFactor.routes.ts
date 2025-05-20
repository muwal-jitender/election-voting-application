import { Router } from "express";
import { TwoFactorController } from "./twoFactor.controller";
import { authenticateJWT } from "middleware/auth.middleware";
import { container } from "tsyringe";

const twoFactorController = container.resolve(TwoFactorController);
const router = Router();
// POST /auth/2fa/setup
router.post("/setup", authenticateJWT, async (req, res, next) => {
  await twoFactorController.generateTOTPSetup(req, res, next);
});

router.post("/verify", authenticateJWT, async (req, res, next) => {
  await twoFactorController.verifyTOTPCode(req, res, next);
});
export default router;
