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
