// src/modules/audit/audit.enums.ts

export enum AuditAction {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  REFRESH_TOKEN = "refresh_token",
  TOKEN_REUSE = "token_reuse",
  TOKEN_REVOKED = "token_revoked",
  IP_MISMATCH = "ip_mismatch",
  UA_MISMATCH = "user_agent_mismatch",
  ADMIN_DOWNGRADED = "admin_downgraded",
  ELECTION_CREATED = "election_created",
  ELECTION_DELETED = "election_deleted",
  USER_REGISTERED = "user_registered",
}
