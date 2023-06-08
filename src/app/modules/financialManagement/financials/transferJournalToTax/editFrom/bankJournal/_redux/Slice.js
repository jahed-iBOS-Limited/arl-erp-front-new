import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  gridData: [],
};

export const bankJournalSlice = createSlice({
  name: "bankJournal",
  initialState: initState,
  reducers: {
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
  },
});
