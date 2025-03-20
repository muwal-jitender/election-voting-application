import { createSlice } from "@reduxjs/toolkit";
import { VoteState } from "types";

const currentVoter = { id: "", token: "", isAdmin: false };
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
    changeCurrentVoter(state, action) {
      state.currentVoter = action.payload;
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

// Exporting actions so we can use them with `dispatch`
export const voteActions = VoteSlice.actions;
// Exporting reducer so it can be used in the Redux store
export default VoteSlice;
