import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  empDDL: [],
  gridData: [],
  singleData: "",
  empClusterList: [],
};

export const competencyTwoSlice = createSlice({
  name: "competencyTwo",
  initialState: initState,
  reducers: {
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },

    SetEmpClusterList: (state, action) => {
      const { payload } = action;
      state.empClusterList = payload;
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
