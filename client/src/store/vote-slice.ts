import { createSlice } from "@reduxjs/toolkit";
import { VoteState } from "../types";

const currentVoter = { id: "v1", token: "john-donne", isAdmin: true };
const initialState: VoteState = {
  addCandidateElectionId: "",
  currentVoter,
  idOfSelectedElection: "",
  selectedElection: "",
  selectedVoteCandidate: "",
};

const VoteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    changeSelectedVoteCandidate(state, action) {
      state.selectedVoteCandidate = action.payload;
    },
    changeSelectedElection(state, action) {
      state.selectedElection = action.payload;
    },
    changeIdOfCandidateElectionId(state, action) {
      state.addCandidateElectionId = action.payload;
    },
    changeAddCandidateElectionId(state, action) {
      state.addCandidateElectionId = action.payload;
    },
  },
});

export const voteActions = VoteSlice.actions;
export default VoteSlice;
