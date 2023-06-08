import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  empDDL: [],
  orderTypeDDL: [],
  poReferenceTypeDDL: [],
  poReferenceNoDDL: [],
  paymentTermsDDL: [],
  incoTermsDDL: [],
  poItemsDDL: [],
  gridData: [],
  singleData: "",
};

export const customerInvoiceSlice = createSlice({
  name: "customerSalesInvoice",
  initialState: initState,
  reducers: {
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },
    SetOrderTypeDDL: (state, action) => {
      const { payload } = action;
      state.orderTypeDDL = payload;
    },
    SetPoReferenceTypeDDL: (state, action) => {
      const { payload } = action;
      state.poReferenceTypeDDL = payload;
    },
    SetPoReferenceNoDDL: (state, action) => {
      const { payload } = action;
      state.poReferenceNoDDL = payload;
    },
    SetPaymentTermsDDL: (state, action) => {
      const { payload } = action;
      state.paymentTermsDDL = payload;
    },
    SetIncoTermsListDDL: (state, action) => {
      const { payload } = action;
      state.incoTermsDDL = payload;
    },
    SetPoItemsDDL: (state, action) => {
      const { payload } = action;
      state.poItemsDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData=[""]
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
