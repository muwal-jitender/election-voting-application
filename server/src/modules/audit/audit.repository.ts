import { AuditLogModel, IAuditLogDocument } from "./audit.model";

import { BaseRepository } from "core/base.repository";
import { singleton } from "tsyringe";

@singleton()
export class AuditRepository extends BaseRepository<IAuditLogDocument> {
  constructor() {
    super(AuditLogModel);
  }
}
