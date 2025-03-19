import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  gridData: [],
  singleData: "",
};
export const callTypes = {
  list: "list",
  action: "action"

};

export const costCenterTypeSlice = createSlice({
  name: "costCenterType",
  initialState: initState,
  reducers: {
    catchError: (state, action) => {
      state.msg = { color: "error", msg: "Login Failed" };
      state.isLoading = false;
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

