import { ILoginModel, ILoginResponse, IRegisterModel } from "../types";

import { API_PATH } from "../utils/api-path.utils";
import { apiRequest } from "./api-request";

// Define Voter model interface

/** Register voter */
export const registerVoter = async (voter: IRegisterModel) => {
  // return await coreService.post(API_PATH.VOTER_REGISTER, voter);
  return await apiRequest<IRegisterModel>(
    API_PATH.VOTER_REGISTER,
    "POST",
    voter,
  );
};
/** Login user */
export const login = async (user: ILoginModel) => {
  return await apiRequest<ILoginResponse>(API_PATH.VOTER_LOGIN, "POST", user);
};
