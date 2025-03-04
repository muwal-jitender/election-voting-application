export interface IElectionModel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  candidates: string[];
  voters: string[];
}
export interface AddElectionModel {
  title: string;
  description: string;
  thumbnail: string;
}
