import { Types } from "mongoose";

// ✅ Extend Express Request interface to include user
export {};
export type AccessTokenPayload = {
  userId: string;
  email: string;
  isAdmin: boolean;
  version: number;
};
export type RefreshTokenPayload = {
  id: Types.ObjectId;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  version: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      refreshTokenPayload?: RefreshTokenPayload;
      refreshToken?: string;
    }
  }
}
