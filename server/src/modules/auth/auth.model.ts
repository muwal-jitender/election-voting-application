import { Document, Schema, model } from "mongoose";

export interface IRefreshTokenDocument extends Document {
  refreshToken: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  isRevoked: boolean;
  expiresAt: Date;
}
const refreshTokenSchema = new Schema<IRefreshTokenDocument>({
  refreshToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  ipAddress: { type: String, required: false },
  userAgent: { type: String, required: false },
  isRevoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

export const RefreshTokenModel = model<IRefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);
