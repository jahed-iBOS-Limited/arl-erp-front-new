import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  empDDL: [],
  sbuDDL: [],
  soldToPartyDDL: [],
  gridData: [],
  partnerLedgerGridData: [],
  businessPartnerDetails: {},
  singleData: "",
};

export const partnerLedgerSlice = createSlice({
  name: "partnerLedger",
  initialState: initState,
  reducers: {
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },

    SetSoldToPartyDDL: (state, action) => {
      const { payload } = action;
      state.soldToPartyDDL = payload;
    },
    setSbuDDL: (state, action) => {
      const { payload } = action;
      state.sbuDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetPartnerledgerGridData: (state, action) => {
      const { payload } = action;
      state.partnerLedgerGridData = payload;
    },

    SetBusinessPartnerDetails: (state, action) => {
      const { payload } = action;
      state.businessPartnerDetails = payload;
    },

    SetBusinessPartnerDetailsEmpty: (state, action) => {
      state.businessPartnerDetails = {};
    },

    SetPartnerledgerGridDataEmpty: (state, action) => {
      state.partnerLedgerGridData = [];
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
