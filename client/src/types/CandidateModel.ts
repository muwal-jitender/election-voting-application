export interface ICandidateModel {
  id: string;
  fullName: string;
  image: string;
  motto: string;
  voteCount: number;
  electionId: string;
}
export interface IAddCandidateModel {
  fullName: string;
  image: File | null;
  motto: string;
  electionId: string;
}
