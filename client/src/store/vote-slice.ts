import { createSlice } from "@reduxjs/toolkit";
import { VoteState } from "types";

// 👤 Default voter object
const currentVoter = { fullName: "", isAdmin: false };

// 🧾 Initial state for vote-related actions
const initialState: VoteState = {
  addCandidateElectionId: "", // 🆔 ID of election where a candidate is being added
  currentVoter, // 👤 Info about the currently logged-in voter
  idOfSelectedElection: "", // 🆔 of selected election
  selectedElection: "", // 🗳️ Current selected election
  selectedVoteCandidate: "", // ✅ Candidate selected for voting
};

const VoteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    // ✅ Store selected candidate for voting
    changeSelectedVoteCandidate(state, action) {
      state.selectedVoteCandidate = action.payload;
    },

    // ✅ Update current voter info
    changeCurrentVoter(state, action) {
      state.currentVoter = action.payload;
    },

    // ✅ Set currently selected election ID
    changeSelectedElection(state, action) {
      state.selectedElection = action.payload;
    },

    // ❗ (Duplicate) Set election ID for adding a candidate
    changeIdOfCandidateElectionId(state, action) {
      state.addCandidateElectionId = action.payload;
    },

    // ✅ Preferred: Set election ID for adding a candidate
    changeAddCandidateElectionId(state, action) {
      state.addCandidateElectionId = action.payload;
    },
  },
});

// ✅ Export actions and reducer
export const voteActions = VoteSlice.actions;
export default VoteSlice;
