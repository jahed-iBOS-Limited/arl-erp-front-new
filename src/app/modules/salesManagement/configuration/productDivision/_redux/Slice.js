import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  productDivisionTypDDL: [],
  parentDivisionTypeDDL: [],
  gridData: [],
  singleData: "",
};

export  const ProductDivisionSlice = createSlice({
  name: "productDivision",
  initialState: initState,
  reducers: {
    SetProductDivisionTypDDL: (state, action) => {
      const { payload } = action;
      state.productDivisionTypDDL = payload;
    },
    SetParentDivisionTypeDDL: (state, action) => {
      const { payload } = action;
      state.parentDivisionTypeDDL = payload;
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

