import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  taxItemNameDDL: [],
  matItemNameDDL: [],
  valueAdditionDDL: [],
  gridData: {},
  supplyTypeDDL: []
};

export const taxPriceSetupSlice = createSlice({
  name: "taxPriceSetup",
  initialState: initState,
  reducers: {
    SetTaxItemNameDDL: (state, action) => {
      const { payload } = action;
      state.taxItemNameDDL = payload;
    },
    SetMatItemNameDDL: (state, action) => {
      const { payload } = action;
      state.matItemNameDDL = payload;
    },
    SetValueAdditionDDL: (state, action) => {
      const { payload } = action;
      state.valueAdditionDDL = payload;
    },
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    setSupplyTypeDDL: (state, action) => {
      const { payload } = action;
      state.supplyTypeDDL = payload;
    },
  }
});

