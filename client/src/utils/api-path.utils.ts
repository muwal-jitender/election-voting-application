const VOTER_CONTROLLER = "/voters";
const AUTH_CONTROLLER = "/auth";
const CANDIDATE_CONTROLLER = "/candidates";
const ELECTION_CONTROLLER = "/elections";

export const AUTH_API = {
  REGISTER: `${AUTH_CONTROLLER}/register`,
  LOGIN: `${AUTH_CONTROLLER}/login`,
  LOGOUT: `${AUTH_CONTROLLER}/logout`,
  REFRESH_TOKEN: `${AUTH_CONTROLLER}/refresh-token`,
  TWO_FA_SETUP: `${AUTH_CONTROLLER}/2fa/setup`,
  TWO_FA_VERIFY: `${AUTH_CONTROLLER}/2fa/verify`,
  TWO_FA_LOGIN: `${AUTH_CONTROLLER}/2fa/verify-login`,
  TWO_FA_DISABLE: `${AUTH_CONTROLLER}/2fa/disable`,
} as const;
export const CANDIDATE_API = {
  // Candidate
  CANDIDATE: `${CANDIDATE_CONTROLLER}`,
  CANDIDATE_ID: `${CANDIDATE_CONTROLLER}/:id`,
  CANDIDATE_VOTE: `${CANDIDATE_CONTROLLER}/:id/elections/:electionId`,
} as const;

export const VOTER_API = {
  VOTER: `${VOTER_CONTROLLER}`,
  LOGIN_USER_DETAIL: `${VOTER_CONTROLLER}/me`,
} as const;
export const ELECTION_API = {
  // Election
  ELECTION: `${ELECTION_CONTROLLER}`,
  ELECTION_RESULTS: `${ELECTION_CONTROLLER}/elections-result`,
  ELECTION_ID: `${ELECTION_CONTROLLER}/:id`,
  ELECTION_GET_CANDIDATES_BY_ID: `${ELECTION_CONTROLLER}/:id/candidates`,
  /**Get Complete details including the voters and candidates  */
  ELECTION_GET_DETAILS_BY_ID: `${ELECTION_CONTROLLER}/:id/details`,
  ELECTION_GET_VOTERS_BY_ID: `${ELECTION_CONTROLLER}/:id/voters`,
  ELECTION_CHECK_IF_VOTER_ALREADY_VOTED: `${ELECTION_CONTROLLER}/:id/voted`,
} as const;

/**
 * Replaces parameter placeholders in an API path string with actual values.
 *
 * This utility is used to resolve dynamic route parameters (e.g., ":id", ":userId")
 * by replacing them with the corresponding values provided in the `params` object.
 *
 * @example
 * const path = resolveApiPath("/users/:userId/posts/:postId", { userId: 123, postId: 456 });
 * // Returns: "/users/123/posts/456"
 *
 * @param {string} path - The API path containing placeholders (e.g., "/resource/:id").
 * @param {Record<string, string | number>} params - An object where each key matches a placeholder name in the path, and the value is what should replace it.
 *
 * @returns {string} The resolved path with all placeholders replaced by their corresponding values.
 */
export const resolveApiPath = (
  path: string,
  params: Record<string, string | number>,
): string => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    path,
  );
};
