import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  referenceTypeDDL: [],
  referenceNoDDL: [],
  transactionTypeDDL: [],
  busiPartnerDDL: [],
  personelDDL: [],
  itemDDL: [],
  costCenterDDL: [],
  stockDDL: [],
  locationTypeDDL: [],
  projectNameDDL: [],
  gridData: [],
  singleData: [],
};

export const invTransactionSlice = createSlice({
  name: "invTransaction",
  initialState: initState,
  reducers: {
    setreferenceTypeDDL: (state, action) => {
      const { payload } = action;
      state.referenceTypeDDL = payload;
    },
    setreferenceNoDDL: (state, action) => {
      const { payload } = action;
      state.referenceNoDDL = payload;
    },
    setTransactionTypeDDL: (state, action) => {
      const { payload } = action;
      state.transactionTypeDDL = payload;
    },
    setbusinessPartDDL: (state, action) => {
      const { payload } = action;
      state.busiPartnerDDL = payload;
    },
    setpersonelDDL: (state, action) => {
      const { payload } = action;
      state.personelDDL = payload;
    },
    setItemDDL: (state, action) => {
      const { payload } = action;
      state.itemDDL = payload;
    },
    setCostCenterDDL: (state, action) => {
      const { payload } = action;
      state.costCenterDDL = payload;
    },
    setstockDDL: (state, action) => {
      const { payload } = action;
      state.stockDDL = payload;
    },
    setLocationTypeDDL: (state, action) => {
      const { payload } = action;
      state.locationTypeDDL = payload;
    },
    setProjectNameDDL: (state, action) => {
      const { payload } = action;
      state.projectNameDDL = payload;
    },
    setGridDataDDL: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    setSingleDDL: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
  },
});
