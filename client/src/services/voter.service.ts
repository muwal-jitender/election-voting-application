import {
  ILoginModel,
  IRegisterModel,
  IUserResponse,
  IVoterModel,
  IVoterService,
} from "../types";

import { API_PATH } from "utils/api-path.utils";
import { apiRequest } from "./api-request";

// Define Voter model interface

/** Register voter */
export const voterService: IVoterService = {
  register: async (voter: IRegisterModel) => {
    return await apiRequest<IVoterModel>(
      API_PATH.VOTER_REGISTER,
      "POST",
      voter,
    );
  },
  /** Login user */
  login: async (user: ILoginModel) => {
    return await apiRequest<IUserResponse>(API_PATH.VOTER_LOGIN, "POST", user);
  },
  logout: async () => {
    return await apiRequest<null>(API_PATH.VOTER_LOGOUT, "POST");
  },
  refreshToken: async () => {
    return await apiRequest<null>(API_PATH.VOTER_LOGOUT, "POST");
  },
  me: async () => {
    return await apiRequest<IUserResponse>(API_PATH.LOGIN_USER_DETAIL, "GET");
  },
};
