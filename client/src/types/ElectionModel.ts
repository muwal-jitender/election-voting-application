import { ICandidateModel } from "./CandidateModel";
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
