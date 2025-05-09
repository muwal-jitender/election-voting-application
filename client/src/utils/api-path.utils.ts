const VOTER_CONTROLLER = "/voters";
const AUTH_CONTROLLER = "/auth";
const CANDIDATE_CONTROLLER = "/candidates";
const ELECTION_CONTROLLER = "/elections";

export const API_PATH = {
  // Voter
  VOTER: `${VOTER_CONTROLLER}`,
  AUTH_REGISTER: `${AUTH_CONTROLLER}/register`,
  AUTH_LOGIN: `${AUTH_CONTROLLER}/login`,
  AUTH_LOGOUT: `${AUTH_CONTROLLER}/logout`,
  AUTH_REFRESH_TOKEN: `${AUTH_CONTROLLER}/refresh-token`,

  LOGIN_USER_DETAIL: `${VOTER_CONTROLLER}/me`,
  // Candidate
  CANDIDATE: `${CANDIDATE_CONTROLLER}`,
  CANDIDATE_ID: `${CANDIDATE_CONTROLLER}/:id`,
  CANDIDATE_VOTE: `${CANDIDATE_CONTROLLER}/:id/elections/:electionId`,
  // Election
  ELECTION: `${ELECTION_CONTROLLER}`,
  ELECTION_RESULTS: `${ELECTION_CONTROLLER}/elections-result`,
  ELECTION_ID: `${ELECTION_CONTROLLER}/:id`,
  ELECTION_GET_CANDIDATES_BY_ID: `${ELECTION_CONTROLLER}/:id/candidates`,
  /**Get Complete details including the voters and candidates  */
  ELECTION_GET_DETAILS_BY_ID: `${ELECTION_CONTROLLER}/:id/details`,
  ELECTION_GET_VOTERS_BY_ID: `${ELECTION_CONTROLLER}/:id/voters`,
  ELECTION_CHECK_IF_VOTER_ALREADY_VOTED: `${ELECTION_CONTROLLER}/:id/voted`,
};

/** Utility function to replace ":id" */
export const resolveApiPath = (
  path: string,
  params: Record<string, string | number>,
) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(params[key])),
    path,
  );
};
