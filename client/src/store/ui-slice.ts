import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IElectionModel, UIState } from "types";

// 🧾 Initial UI state
const initialState: UIState = {
  addCandidateModalShowing: false,
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
  enable2FAModalShowing: false,
  selectedElection: null,

  // 🛑 Confirm modal dialog state
  openConfirmModal: false,
  confirmModalHeading: "",
  confirmModalCallback: null,
};

const UiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // 🔘 Candidate Modal: Add
    openAddCandidateModal(state) {
      state.addCandidateModalShowing = true;
    },
    closeAddCandidateModal(state) {
      state.addCandidateModalShowing = false;
    },

    // 🔘 Candidate Modal: Vote
    openVoteCandidateModal(state) {
      state.voteCandidateModalShowing = true;
    },
    closeVoteCandidateModal(state) {
      state.voteCandidateModalShowing = false;
    },

    // 🔘 Election Modal: Add
    openAddElectionModal(state) {
      state.electionModalShowing = true;
    },
    closeAddElectionModal(state) {
      state.electionModalShowing = false;
    },
    // 🔘 Enable 2FA Authentication
    open2FAAuthenticationModal(state) {
      state.enable2FAModalShowing = true;
    },
    close2FAAuthenticationModal(state) {
      state.enable2FAModalShowing = false;
    },

    // 🔘 Election Modal: Update (with selected election info)
    openUpdateElectionModal(state, action: PayloadAction<IElectionModel>) {
      state.updateElectionModalShowing = true;
      state.selectedElection = action.payload;
    },
    closeUpdateElectionModal(state) {
      state.updateElectionModalShowing = false;
    },

    // ⚠️ Confirm Modal Dialog: Open with heading and callback
    openConfirmModalDialog(
      state,
      action: PayloadAction<{ heading: string; callback: () => void }>,
    ) {
      state.openConfirmModal = true;
      state.confirmModalHeading = action.payload.heading;
      state.confirmModalCallback = action.payload.callback;
    },

    // ❌ Confirm Modal Dialog: Close
    closeConfirmModalDialog(state) {
      state.openConfirmModal = false;
      state.confirmModalHeading = "";
      state.confirmModalCallback = null;
    },
  },
});

// 🔁 Export actions and reducer
export const UiActions = UiSlice.actions;
export default UiSlice;
