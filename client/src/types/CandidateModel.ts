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
