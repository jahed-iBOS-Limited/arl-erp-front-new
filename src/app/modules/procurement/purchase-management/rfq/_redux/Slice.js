import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  gridData: [],
  singleData: "",
  refNoDDL: "",
  itemDDL: "",
  uoMDDL: "",
  quotationGridData: [],
  csData: [],
};

export const rfqSlice = createSlice({
  name: "rfq",
  initialState: initState,
  reducers: {

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetCsData: (state, action) => {
      const { payload } = action;
      state.csData = payload;
    },

    SetQuotationData: (state, action) => {
      const { payload } = action;
      state.quotationGridData = payload;
    },

    SetGridDataEmpty: (state, action) => {
      state.gridData = [];
    },

    SetCurrencyDDL: (state, action) => {
      const { payload } = action;
      state.currencyDDL = payload;
    },

    SetItemDDL: (state, action) => {
      const { payload } = action;
      state.itemDDL = payload;
    },

    SetuoMDDL: (state, action) => {
      const { payload } = action;
      state.uoMDDL = payload;
    },

    SetRefNoDDL: (state, action) => {
      const { payload } = action;
      state.refNoDDL = payload;
    },
    
    SetSingleData: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    
    SetSingleStoreEmpty: (state, action) => {
      
      state.singleData = "";
    },

  }
});

