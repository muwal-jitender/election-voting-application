export interface UIState {
  addCandidateModalShowing: boolean;
  voteCandidateModalShowing: boolean;
  electionModalShowing: boolean;
  updateElectionModalShowing: boolean;
}

export interface Voter {
  id: string;
  token: string;
  isAdmin: boolean;
}

export interface VoteState {
  addCandidateElectionId: string;
  currentVoter: Voter;
  idOfSelectedElection: string;
  selectedElection: string;
  selectedVoteCandidate: string;
}

export interface RootState {
  ui: UIState;
  vote: VoteState;
  // Add other slices of state here
}
