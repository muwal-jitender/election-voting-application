import { Router } from "express";
import { TwoFactorController } from "./twoFactor.controller";
import { authenticateJWT } from "middleware/auth.middleware";
import { container } from "tsyringe";
import { rateLimiter } from "middleware/rateLimiter.middleware";

const twoFactorController = container.resolve(TwoFactorController);
const router = Router();
const rateLimiterOptions = {
  max: 5,
  windowMs: 5 * 60 * 1000,
  message: "⚠️ Too many login attempts. Please wait 5 minutes.",
};
// POST /auth/2fa/setup
router.post(
  "/setup",
  authenticateJWT,
  rateLimiter(rateLimiterOptions),
  async (req, res, next) => {
    await twoFactorController.generateTOTPSetup(req, res, next);
  }
);

router.post(
  "/verify",
  authenticateJWT,
  rateLimiter(rateLimiterOptions),
  async (req, res, next) => {
    await twoFactorController.verifyTOTPCode(req, res, next);
  }
);
router.post(
  "/verify-login",
  rateLimiter(rateLimiterOptions),
  async (req, res, next) => {
    await twoFactorController.verify2FA(req, res, next);
  }
);
export default router;
