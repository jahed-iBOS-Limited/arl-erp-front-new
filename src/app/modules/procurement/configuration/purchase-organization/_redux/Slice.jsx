import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  gridData: [],
  singleData: "",
};

export const purchaseOrgSlice = createSlice({
  name: "purchaseOrg",
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
    SetSingleStoreEmpty: state => {
      state.singleData = "";
    },

  }
});

