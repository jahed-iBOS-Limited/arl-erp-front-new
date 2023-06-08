import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  gridData: [],
  IsPGICheck: {},
  singleData: "",
};

export const PGISlice = createSlice({
  name: "pgi",
  initialState: initState,
  reducers: {
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
    SetIsPGICheck: (state, action) => {
      const { payload } = action;
      state.IsPGICheck = payload;
    },
  },
});
