export interface IVoterModel {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: string;
  votedElectionIds?: string[];
}
export interface ILoginModel {
  email: string;
  password: string;
}
export interface ILoginResponse {
  token: string;
  response: IVoterModel;
}

export interface IRegisterModel {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
