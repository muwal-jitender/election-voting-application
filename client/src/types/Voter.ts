export interface Voter {
  id: string;
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  votedElectionIds: string[];
}
