import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  gridData: [],
};

export const cashJournalSlice = createSlice({
  name: "cashJournal",
  initialState: initState,
  reducers: {
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
  },
});
