import {
  ILoginModel,
  ILoginResponse,
  IRegisterModel,
  IUserDetail,
} from "../types";

import { API_PATH } from "utils/api-path.utils";
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
export const logout = async () => {
  return await apiRequest<null>(API_PATH.VOTER_LOGOUT, "POST");
};
export const me = async () => {
  return await apiRequest<IUserDetail>(API_PATH.LOGIN_USER_DETAIL, "GET");
};
