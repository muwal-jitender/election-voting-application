const VOTER_CONTROLLER = "/voters";
const CANDIDATE_CONTROLLER = "/candidates";
const ELECTION_CONTROLLER = "/elections";

export const API_PATH = {
  // Voter
  VOTER: `${VOTER_CONTROLLER}`,
  VOTER_REGISTER: `${VOTER_CONTROLLER}/register`,
  VOTER_LOGIN: `${VOTER_CONTROLLER}/login`,
  VOTER_LOGOUT: `${VOTER_CONTROLLER}/logout`,
  // Candidate
  CANDIDATE: `${CANDIDATE_CONTROLLER}`,
  CANDIDATE_ID: `${CANDIDATE_CONTROLLER}/:id`,
  CANDIDATE_VOTE: `${CANDIDATE_CONTROLLER}/:id/elections/:electionId`,
  // Election
  ELECTION: `${ELECTION_CONTROLLER}`,
  ELECTION_ID: `${ELECTION_CONTROLLER}/:id`,
  ELECTION_GET_CANDIDATES_BY_ID: `${ELECTION_CONTROLLER}/:id/candidates`,
  /**Get Complete details including the voters and candidates  */
  ELECTION_GET_DETAILS_BY_ID: `${ELECTION_CONTROLLER}/:id/details`,
  ELECTION_GET_VOTERS_BY_ID: `${ELECTION_CONTROLLER}/:id/voters`,
  ELECTION_CHECK_IF_VOTER_ALREADY_VOTED: `${ELECTION_CONTROLLER}/:id/voted`,
};

/** Utility function to replace ":id" */
export const getApiPath = (
  path: string,
  params: Record<string, string | number>,
) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(params[key])),
    path,
  );
};
