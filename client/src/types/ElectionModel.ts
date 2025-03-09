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
export interface IAddElection {
  title: string;
  description: string;
  thumbnail: File | null;
}
export interface IVoterVotedResponse {
  voted: boolean;
}
