import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  groupParentDDL:[],
  gridData: [],
  singleData: "",
};

export const profitCenterGroupSlice = createSlice({
  name: "profitCenterGroup",
  initialState: initState,
  reducers: {
    catchError: (state, action) => {
      state.msg = { color: "error", msg: "Login Failed" };
      state.isLoading = false;
    },
    
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
    SetSingleStoreEmpty: state => {
      state.singleData = "";
    },
  }
});

