import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addCandidateModalShowing: false,
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
};
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAddCandidateModal(state) {
      state.addCandidateModalShowing = true;
    },
    closeAddCandidateModal(state) {
      state.addCandidateModalShowing = false;
    },
    openVoteCandidateModal(state) {
      state.voteCandidateModalShowing = true;
    },
    closeVoteCandidateModal(state) {
      state.voteCandidateModalShowing = false;
    },
    openElectionModalModal(state) {
      state.electionModalShowing = true;
    },
    closeElectionModalModal(state) {
      state.electionModalShowing = false;
    },
    openUpdateElectionModal(state) {
      state.updateElectionModalShowing = true;
    },
    closeUpdateElectionModal(state) {
      state.updateElectionModalShowing = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
