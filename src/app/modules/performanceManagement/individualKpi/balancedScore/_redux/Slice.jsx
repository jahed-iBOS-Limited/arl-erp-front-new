import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  sbuDDL: [],
  departmentDDL: [],
  employeeDDL: [],
};

export const inDividualBalancedScoreSlice = createSlice({
  name: "inDividualBalancedScore",
  initialState: initState,
  reducers: {
    SetSbuDDL: (state, action) => {
      const { payload } = action;
      state.sbuDDL = payload;
    },

    SetDepartmentDDL: (state, action) => {
      const { payload } = action;
      state.departmentDDL = payload;
    },

    SetEmployeeDDL: (state, action) => {
      const { payload } = action;
      state.employeeDDL = payload;
    },

    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
  },
});
