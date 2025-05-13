import { Document, Schema, model } from "mongoose";

export interface IRefreshTokenDocument extends Document {
  refreshToken: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  isRevoked: boolean;
  expiresAt: Date;
  issuedAt: Date;
  lastUsedAt?: Date;
  usedAt: Date | null;
}
const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    refreshToken: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    ipAddress: { type: String, required: false },
    userAgent: { type: String, required: false },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    issuedAt: { type: Date, required: true },
    lastUsedAt: { type: Date, required: false },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Convert `_id` to `id` when returning data
refreshTokenSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString(); // Map `_id` to `id`
    delete ret._id; // Remove `_id`
    delete ret.__v; // Remove version key
    return ret;
  },
});

export const RefreshTokenModel = model<IRefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);
