import { AuditAction } from "modules/audit/audit.enums";
import { AuditLogDTO } from "modules/audit/audit.dto";
import { Request } from "express";
import { Types } from "mongoose";
import { jwtService } from "./jwt-service.utils";

export const auditLogUtil = {
  payload: (
    req: Request,
    action: AuditAction,
    metadata?: object,
    userId?: Types.ObjectId
  ) => {
    const { ipAddress, userAgent } = jwtService.extractRequestMeta(req);
    const dto: AuditLogDTO = {
      userId: userId,
      action: action,
      ipAddress: ipAddress,
      userAgent: userAgent,
      timestamp: new Date(),
      metadata: metadata,
    };
    return dto;
  },
};
