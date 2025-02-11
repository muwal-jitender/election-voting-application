export interface UIState {
  addCandidateModalShowing: boolean;
  voteCandidateModalShowing: boolean;
  electionModalShowing: boolean;
  updateElectionModalShowing: boolean;
}

export interface RootState {
  ui: UIState;
  // Add other slices of state here
}
