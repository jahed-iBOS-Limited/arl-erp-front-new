import { createSlice } from "@reduxjs/toolkit";
const initState = {
  isLoading: false,
  error: "",
  msg: "",
  empDDL: [],
  groupNameDDL: [],
  gridData: [],
  singleData: "",
};

export const profitCenterSlice = createSlice({
  name: "profitCenter",
  initialState: initState,
  reducers: {
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },
    SetGroupNameDDL: (state, action) => {
      const { payload } = action;
      state.groupNameDDL = payload;
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
