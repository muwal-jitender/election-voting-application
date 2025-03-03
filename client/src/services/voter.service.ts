import { API_PATH } from "../utils/api-path.utils";
import { apiRequest } from "./api-request";

// Define Voter model interface
export interface Voter {
  fullName: string;
  email: string;
  password: string;
  votedElectionIds?: string[];
  isAdmin?: boolean;
}

/** Register voter */
export const register = async (voter: Voter) => {
  // return await coreService.post(API_PATH.VOTER_REGISTER, voter);
  return await apiRequest<Voter>(API_PATH.VOTER_REGISTER, "POST", voter);
};
