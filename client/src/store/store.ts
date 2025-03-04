import { configureStore } from "@reduxjs/toolkit";
import UiSlice from "./ui-slice";
import VoteSlice from "./vote-slice";

const store = configureStore({
  reducer: { ui: UiSlice.reducer, vote: VoteSlice.reducer },
});
export type RootState = ReturnType<typeof store.getState>; // Type for the Redux state

export default store;
