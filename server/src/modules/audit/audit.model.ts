import { Document, Schema, Types, model } from "mongoose";

import { AuditAction } from "./audit.enums";

export interface IAuditLogDocument extends Document {
  userId?: Types.ObjectId | null; // Optional for unauthenticated actions
  action: AuditAction;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, any>; // Flexible payload
}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: false },
    action: { type: String, enum: Object.values(AuditAction), required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed, default: {} }, // Flexible payload
  },
  { timestamps: true }
);

// Convert `_id` to `id` when returning data
auditLogSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString(); // Map `_id` to `id`
    delete ret._id; // Remove `_id`
    delete ret.__v; // Remove version key
    return ret;
  },
});

export const AuditLogModel = model<IAuditLogDocument>(
  "Audit_Logs",
  auditLogSchema
);
