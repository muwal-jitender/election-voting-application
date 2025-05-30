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

import { API_PATH } from "utils/api-path.utils";
import { apiRequest } from "./api-request";

// Define Voter model interface

/** Register voter */
export const voterService: IVoterService = {
  register: async (voter: IRegisterModel) => {
    return await apiRequest<IVoterModel>(API_PATH.AUTH_REGISTER, "POST", voter);
  },
  /** Login user */
  login: async (user: ILoginModel) => {
    return await apiRequest<IUserResponse>(API_PATH.AUTH_LOGIN, "POST", user);
  },
  logout: async () => {
    return await apiRequest<null>(API_PATH.AUTH_LOGOUT, "POST");
  },
  refreshToken: async () => {
    return await apiRequest<null>(API_PATH.AUTH_REFRESH_TOKEN, "POST");
  },
  setup: async () => {
    return await apiRequest<I2FASetupResponse>(API_PATH.AUTH_2FA_SETUP, "POST");
  },
  verify: async (model: I2FAVerifyModel) => {
    return await apiRequest<null>(API_PATH.AUTH_2FA_VERIFY, "POST", model);
  },
  me: async () => {
    return await apiRequest<IUserResponse>(API_PATH.LOGIN_USER_DETAIL, "GET");
  },
  twoFAlogin: async (twoFALoginModel: I2FALoginModel) => {
    return await apiRequest<IUserResponse>(
      API_PATH.AUTH_2FA_LOGIN,
      "POST",
      twoFALoginModel,
    );
  },
  disable2FA: async () => {
    return await apiRequest(API_PATH.AUTH_2FA_DISABLE, "POST", {});
  },
};
