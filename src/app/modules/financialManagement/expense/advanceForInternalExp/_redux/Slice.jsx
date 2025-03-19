import { createSlice } from "@reduxjs/toolkit";

const initState = {
  selectedSBU: {},
  gridData: [],
};

export const adInternalExp = createSlice({
  name: "adInternalExp",
  initialState: initState,
  reducers: {
    setSelectedSBU: (state, action) => {
      const { payload } = action;
      state.selectedSBU = payload;
    },
    // get grid Data
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    SetGridDataEmpty: (state, action) => {
      state.gridData = [];
    },
  },
});
