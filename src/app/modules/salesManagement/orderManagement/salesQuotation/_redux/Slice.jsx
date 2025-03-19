import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  salesOrg: [],
  soldToParty: [],
  setSpction: [],
  gridData: [],
  singleData: "",
};

export const salesQuotationSlice = createSlice({
  name: "salesQuotation",
  initialState: initState,
  reducers: {
    SetSalesOrg: (state, action) => {
      const { payload } = action;
      state.salesOrg = payload;
    },
    SetSpctionDDL: (state, action) => {
      const { payload } = action;
      state.setSpction = payload;
    },
    SetSoldToParty: (state, action) => {
      const { payload } = action;
      state.soldToParty = payload;
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
