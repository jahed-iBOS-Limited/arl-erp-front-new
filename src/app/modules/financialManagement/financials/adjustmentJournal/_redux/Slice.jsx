import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  sbuDDL: [],
  glDDL: [],
  gridData: [],
};

export const adjustmentJournalSlice = createSlice({
  name: "adjustmentJournal",
  initialState: initState,
  reducers: {

    SetSbuDDL: (state, action) => {
      const { payload } = action;
      state.sbuDDL = payload;
    },

    setGLDDL: (state, action) => {
      const { payload } = action;
      state.glDDL = payload;
    },
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

  }
});

