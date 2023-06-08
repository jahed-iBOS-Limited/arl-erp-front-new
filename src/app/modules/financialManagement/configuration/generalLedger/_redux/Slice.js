import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  groupDDL: [],
  classDDL: [],
  categoryDDL: [],
  accountTypeDDL: [],
  buDDL: [],
  gridData: [],
  singleData: "",
  extendData:"",
  accountClass: [],
  accountCategory: [],
  generalLedger: []
};

export const generalLedgerSlice = createSlice({
  name: "generalLedger",
  initialState: initState,
  reducers: {
    SetGroupDDL: (state, action) => {
      const { payload } = action;
      state.groupDDL = payload;
    },
    SetClassDDL: (state, action) => {
      const { payload } = action;
      state.classDDL = payload;
    },
    SetCategoryDDL: (state, action) => {
      const { payload } = action;
      state.categoryDDL = payload;
    },
    SetAccountTypeDDL: (state, action) => {
      const { payload } = action;
      state.accountTypeDDL = payload;
    },
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },

    SetBuDDL: (state, action) => {
      const { payload } = action;
      state.buDDL = payload;
    },

    SetExtendData: (state, action) => {
      const { payload } = action;
      state.extendData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
    SetAccountClass : (state, action) => {
      const { payload } = action;
      state.accountClass = payload;
    },
    SetAccountCategory : (state, action) => {
      const { payload } = action;
      state.accountCategory = payload;
    },
    SetGeneralLedger : (state, action) => {
      const { payload } = action;
      state.generalLedger = payload;
    }
  },
});
