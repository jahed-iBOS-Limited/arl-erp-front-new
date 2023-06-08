import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  generalLedgerDDL: [],
  controllingUnitSelectedId: "",
  gridData: [],
  singleData: "",
};

export const costElementSlice = createSlice({
  name: "costElement",
  initialState: initState,
  reducers: {

    SetgeneralLedgerDDL: (state, action) => {
      const { payload } = action;
      state.generalLedgerDDL = payload;
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

