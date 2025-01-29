import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  groupParentDDL: [],
  gridData: [],
  singleData: "",
};

export const costCenterGroupSlice = createSlice({
  name: "costCenterGroup",
  initialState: initState,
  reducers: {
    SetGroupParentDDL: (state, action) => {
      const { payload } = action;
      state.groupParentDDL = payload;
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
