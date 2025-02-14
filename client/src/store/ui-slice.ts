import { createSlice } from "@reduxjs/toolkit";
import { UIState } from "../types";

const initialState: UIState = {
  addCandidateModalShowing: false,
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
};
const UiSlice = createSlice({
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
    openAddElectionModal(state) {
      state.electionModalShowing = true;
    },
    closeAddElectionModal(state) {
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

export const UiActions = UiSlice.actions;
export default UiSlice;
