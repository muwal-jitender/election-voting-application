const VOTER_CONTROLLER = "/voters";
const CANDIDATE_CONTROLLER = "/candidates";
const ELECTION_CONTROLLER = "/elections";

export const API_PATH = {
  // Voter
  VOTER: `${VOTER_CONTROLLER}`,
  VOTER_REGISTER: `${VOTER_CONTROLLER}/register`,
  VOTER_LOGIN: `${VOTER_CONTROLLER}/login`,
  // Candidate
  CANDIDATE_CREATE: `${CANDIDATE_CONTROLLER}/login`,
  // Election
  ELECTION: `${ELECTION_CONTROLLER}`,
  ELECTION_GET_CANDIDATES_BY_ID: `${ELECTION_CONTROLLER}/:id/candidates`,
  ELECTION_GET_VOTERS_BY_ID: `${ELECTION_CONTROLLER}/:id/voters`,
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
