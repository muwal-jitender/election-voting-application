import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IElectionModel, UIState } from "../types";

const initialState: UIState = {
  addCandidateModalShowing: false,
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
  selectedElection: null,
  // ✅ Initial states for Confirm Dialog
  openConfirmModal: false,
  confirmModalHeading: "",
  confirmModalCallback: null,
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
    openUpdateElectionModal(state, action: PayloadAction<IElectionModel>) {
      state.updateElectionModalShowing = true;
      state.selectedElection = action.payload;
    },
    closeUpdateElectionModal(state) {
      state.updateElectionModalShowing = false;
    },
    // ✅ Manage Confirm Dialog
    openConfirmModalDialog(
      state,
      action: PayloadAction<{ heading: string; callback: () => void }>,
    ) {
      state.openConfirmModal = true;
      state.confirmModalHeading = action.payload.heading;
      state.confirmModalCallback = action.payload.callback;
    },
    closeConfirmModalDialog(state) {
      state.openConfirmModal = false;
      state.confirmModalHeading = "";
      state.confirmModalCallback = null;
    },
  },
});

export const UiActions = UiSlice.actions;
export default UiSlice;
