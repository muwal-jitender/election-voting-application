import { AUTH_API, VOTER_API } from "utils/api-path.utils";
import {
  I2FALoginModel,
  I2FASetupResponse,
  I2FAVerifyModel,
  ILoginModel,
  IRegisterModel,
  IUserResponse,
  IVoterModel,
  IVoterService,
} from "../types";

import { apiRequest } from "./api-request";

// Define Voter model interface

/** Register voter */
export const voterService: IVoterService = {
  register: async (voter: IRegisterModel) => {
    return await apiRequest<IVoterModel>(AUTH_API.REGISTER, "POST", voter);
  },
  /** Login user */
  login: async (user: ILoginModel) => {
    return await apiRequest<IUserResponse>(AUTH_API.LOGIN, "POST", user);
  },
  logout: async () => {
    return await apiRequest<null>(AUTH_API.LOGOUT, "POST");
  },
  refreshToken: async () => {
    return await apiRequest<null>(AUTH_API.REFRESH_TOKEN, "POST");
  },
  setup: async () => {
    return await apiRequest<I2FASetupResponse>(AUTH_API.TWO_FA_SETUP, "POST");
  },
  verify: async (model: I2FAVerifyModel) => {
    return await apiRequest<null>(AUTH_API.TWO_FA_VERIFY, "POST", model);
  },
  me: async () => {
    return await apiRequest<IUserResponse>(VOTER_API.LOGIN_USER_DETAIL, "GET");
  },
  twoFAlogin: async (twoFALoginModel: I2FALoginModel) => {
    return await apiRequest<IUserResponse>(
      AUTH_API.TWO_FA_LOGIN,
      "POST",
      twoFALoginModel,
    );
  },
  disable2FA: async () => {
    return await apiRequest(AUTH_API.TWO_FA_DISABLE, "POST", {});
  },
};
