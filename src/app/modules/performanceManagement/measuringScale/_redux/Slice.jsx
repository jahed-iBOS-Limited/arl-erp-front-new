import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  scaleForDDL: [],
  gridData: [],
};

export const measuringScaleTwoSlice = createSlice({
  name: "measuringScaleTwo",
  initialState: initState,
  reducers: {

    SetScaleForDDL: (state, action) => {
      const { payload } = action;
      state.scaleForDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
  }
});

