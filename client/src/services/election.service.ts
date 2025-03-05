import { ICandidateModel, IElectionModel, IVoterVotedResponse } from "../types";
import { API_PATH, getApiPath } from "../utils/api-path.utils";

import { apiRequest } from "./api-request";

// Define Voter model interface

/** Get All Elections */
export const getAllElections = async () => {
  return await apiRequest<IElectionModel[]>(API_PATH.ELECTION, "GET");
};
/** Get All Candidates by Elections id */
export const getCandidatesByElectionId = async (id: string) => {
  return await apiRequest<ICandidateModel[]>(
    getApiPath(API_PATH.ELECTION_GET_CANDIDATES_BY_ID, { id: id }),
    "GET",
  );
};
export const checkIfVoterAlreadyVoted = async (id: string) => {
  return await apiRequest<IVoterVotedResponse>(
    getApiPath(API_PATH.ELECTION_CHECK_IF_VOTER_ALREADY_VOTED, { id: id }),
    "GET",
  );
};
