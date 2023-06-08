import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  salesOfficeDDL: [],
  soldToPartyDDL: [],
  BUsalesOrgIncotermDDL: [],
  paymentTermsDDL: [],
  gridData: [],
  singleData: "",
  salesOrgDDL: [],
};

export const salesContactSlice = createSlice({
  name: "salesContact",
  initialState: initState,
  reducers: {
    SetSalesOfficeDDL: (state, action) => {
      const { payload } = action;
      state.salesOfficeDDL = payload;
    },
    SetSoldToPPDDL: (state, action) => {
      const { payload } = action;
      state.soldToPartyDDL = payload;
    },
    SetBUsalesOrgIncotermDDL: (state, action) => {
      const { payload } = action;
      state.BUsalesOrgIncotermDDL = payload;
    },
    SetPaymentTermsDDL: (state, action) => {
      const { payload } = action;
      state.paymentTermsDDL = payload;
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
    SetSalesOrgDDL: (state, action) => {
      const { payload } = action;
      state.salesOrgDDL = payload;
    },
  },
});
