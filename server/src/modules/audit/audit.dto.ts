import { AuditAction } from "./audit.enums";
import { Types } from "mongoose";

export class AuditLogDTO {
  userId?: Types.ObjectId | null; // Optional for unauthenticated actions
  action!: AuditAction;
  ipAddress!: string;
  userAgent!: string;
  timestamp!: Date;
  metadata?: Record<string, any>; // Flexible payload
}
