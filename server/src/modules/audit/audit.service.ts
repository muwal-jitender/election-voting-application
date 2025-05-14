import { inject, singleton } from "tsyringe";
import { AuditRepository } from "./audit.repository";

import { AuditLogDTO } from "./audit.dto";

@singleton()
export class AuditService {
  constructor(
    @inject(AuditRepository) private auditRepository: AuditRepository
  ) {}

  async logAction(payload: AuditLogDTO) {
    await this.auditRepository.create(payload);
  }
}
