// src/modules/audit/audit.enums.ts

export enum AuditAction {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  REFRESH_TOKEN = "refresh_token",
  REFRESH_TOKEN_INVALID_USER = "refresh_token_invalid_user",
  TOKEN_REUSE = "token_reuse",
  TOKEN_REVOKED = "token_revoked",
  IP_MISMATCH = "ip_mismatch",
  UA_MISMATCH = "user_agent_mismatch",
  ADMIN_DOWNGRADED = "admin_downgraded",
  ELECTION_CREATED = "election_created",
  ELECTION_DELETED = "election_deleted",
  ELECTION_UPDATED = "election_updated",
  VOTE_CONFIRMED = "vote_confirmed",
  USER_REGISTERED = "user_registered",
  CANDIDATE_CREATED = "candidate_created",
  CANDIDATE_DELETED = "candidate_deleted",
  VOTE_CAST = "vote_cast",

  TWO_FA_SETUP_INITIATED = "two_fa_setup_initiated",
  TWO_FA_VERIFICATION_SUCCESS = "two_fa_verification_success",
  TWO_FA_VERIFICATION_FAILED = "two_fa_verification_failed",
}
