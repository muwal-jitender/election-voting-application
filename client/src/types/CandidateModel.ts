export interface CandidateModel {
  id: string;
  fullName: string;
  image: string;
  motto: string;
  voteCount: number;
  electionId: string;
}
export interface AddCandidateModel {
  fullName: string;
  image: string;
  motto: string;
}
