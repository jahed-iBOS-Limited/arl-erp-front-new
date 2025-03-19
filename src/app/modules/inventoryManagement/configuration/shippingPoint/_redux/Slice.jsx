import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  warehouseDDL: [],
  gridData: [],
  singleData: "",
};

export const shippingPointSlice = createSlice({
  name: "shippingPoint",
  initialState: initState,
  reducers: {
    SetWarehouseDDL: (state, action) => {
      const { payload } = action;
      state.warehouseDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = ""
      state.singleData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
  },
});
