import { ICandidateModel } from "./CandidateModel";
import { IApiResponse } from "./ResponseModel";
import { IVoterModel } from "./VoterModel";

export interface IElectionModel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}
export interface IElectionDetail extends IElectionModel {
  candidates: ICandidateModel[];
  voters: IVoterModel[];
}
export interface IAddElection extends Omit<IElectionModel, "id" | "thumbnail"> {
  thumbnail: File;
}
export interface IEditElection extends Omit<IAddElection, "thumbnail"> {
  thumbnail?: File | null;
}
export interface IVoterVotedResponse {
  voted: boolean;
}

export interface IElectionService {
  create: (payload: IAddElection) => Promise<IApiResponse<IElectionModel>>;
  update: (
    id: string,
    payload: IEditElection,
  ) => Promise<IApiResponse<IElectionModel>>;
  getAll: () => Promise<IApiResponse<IElectionDetail[]>>;
  getResults: () => Promise<IApiResponse<IElectionDetail[]>>;
  getCandidatesByElectionId: (
    id: string,
  ) => Promise<IApiResponse<ICandidateModel[]>>;
  delete: (id: string) => Promise<IApiResponse<IElectionModel>>;
  checkIfVoterAlreadyVoted: (
    id: string,
  ) => Promise<IApiResponse<IVoterVotedResponse>>;
  getFullDetail: (id: string) => Promise<IApiResponse<IElectionDetail>>;
}
