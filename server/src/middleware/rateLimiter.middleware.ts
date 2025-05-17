// src/middleware/rateLimiter.ts

import { Request } from "express";
import rateLimit from "express-rate-limit";

export const rateLimiter = (options?: {
  max?: number;
  windowMs?: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) => {
  const {
    max = 100, // ✅ Default for global
    windowMs = 15 * 60 * 1000,
    message = "⚠️ Too many requests. Please try again later.",
    keyGenerator = (req: Request) => {
      const id = req.refreshTokenPayload?.id;
      return id ? id.toString() : req.ip || "unknown";
    },
  } = options || {};

  return rateLimit({
    max,
    windowMs,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
  });
};
