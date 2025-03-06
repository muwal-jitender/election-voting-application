export interface IElectionModel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  candidates: string[];
  voters: string[];
}
export interface IAddElection {
  title: string;
  description: string;
  thumbnail: File | null;
}
export interface IVoterVotedResponse {
  voted: boolean;
}
