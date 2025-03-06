const VOTER_CONTROLLER = "/voters";
const CANDIDATE_CONTROLLER = "/candidates";
const ELECTION_CONTROLLER = "/elections";

export const API_PATH = {
  // Voter
  VOTER: `${VOTER_CONTROLLER}`,
  VOTER_REGISTER: `${VOTER_CONTROLLER}/register`,
  VOTER_LOGIN: `${VOTER_CONTROLLER}/login`,
  // Candidate
  CANDIDATE: `${CANDIDATE_CONTROLLER}`,
  CANDIDATE_VOTE: `${CANDIDATE_CONTROLLER}/:id`,
  // Election
  ELECTION: `${ELECTION_CONTROLLER}`,
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
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(`:${key}`, String(params[key])),
    path,
  );
};
