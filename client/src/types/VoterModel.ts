import { IApiResponse } from "./ResponseModel";

export interface IVoterModel {
  id: string;
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  votedElectionIds: string[];
}
export interface ILoginModel {
  email: string;
  password: string;
}
export interface IUserResponse
  extends Omit<
    IVoterModel,
    "id" | "password" | "createdAt" | "votedElectionIds"
  > {}

export interface IRegisterModel
  extends Omit<
    IVoterModel,
    "id" | "isAdmin" | "createdAt" | "votedElectionIds"
  > {
  confirmPassword: string;
}
export interface IUserDetail
  extends Omit<
    IVoterModel,
    "id" | "password" | "createdAt" | "votedElectionIds"
  > {}

export interface IVoterService {
  register: (voter: IRegisterModel) => Promise<IApiResponse<IVoterModel>>;
  login: (user: ILoginModel) => Promise<IApiResponse<IUserResponse>>;
  logout: () => Promise<IApiResponse<null>>;
  me: () => Promise<IApiResponse<IUserResponse>>;
}
