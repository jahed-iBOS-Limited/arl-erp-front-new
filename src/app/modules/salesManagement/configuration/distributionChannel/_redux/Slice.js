import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  SBUListDDL: [],
  gridData: [],
  singleData: "",
};

export const distributionChannelSlice = createSlice({
  name: "distributionChannel",
  initialState: initState,
  reducers: {
    SetSBUListDDL: (state, action) => {
      const { payload } = action;
      state.SBUListDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
  },
});
