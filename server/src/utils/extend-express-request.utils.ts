import mongoose from "mongoose";

// ✅ Extend Express Request interface to include user
export {};
export type AccessTokenPayload = {
  userId: string;
  email: string;
  isAdmin: boolean;
};
export type RefreshTokenPayload = {
  id: mongoose.Types.ObjectId;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
