import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  bankDDL: [],
  bankAccountTypeDDL: [],
  viewModalData: "",
  gridData: [],
  singleData: "",
};

export const bankAccountSlice = createSlice({
  name: "bankAccount",
  initialState: initState,
  reducers: {

    SetBankDDL: (state, action) => {
      const { payload } = action;
      state.bankDDL = payload;
    },

    setBankAccountTypeDDL: (state, action) => {
      const { payload } = action;
      state.bankAccountTypeDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetViewModalData: (state, action) => {
      const { payload } = action;
      state.viewModalData = payload;
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

