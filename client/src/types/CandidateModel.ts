import { IApiResponse } from "./ResponseModel";

export interface ICandidateModel {
  id: string;
  fullName: string;
  image: string;
  motto: string;
  voteCount: number;
  electionId: string;
}
export interface IAddCandidateModel
  extends Omit<ICandidateModel, "id" | "voteCount" | "image"> {
  image: File;
}

export interface ICandidateService {
  create: (
    payload: IAddCandidateModel,
    electionId: string,
  ) => Promise<IApiResponse<ICandidateModel>>;
  remove: (id: string) => Promise<IApiResponse<ICandidateModel>>;
  vote: (
    id: string,
    electionId: string,
  ) => Promise<IApiResponse<ICandidateModel>>;
}
