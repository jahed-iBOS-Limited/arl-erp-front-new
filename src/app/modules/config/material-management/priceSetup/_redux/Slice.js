import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  gridData: [],
  singleData: "",
  conditionDDL: [],
  organizationDDL: [],
  territoryDDL: [],
  partnerDDL: [],
  distributionChannelDDL: [],
  itemSalesDDL:[]
};

export const priceSetupSlice = createSlice({
  name: "priceSetup",
  initialState: initState,
  reducers: {
    SetConditionDDL: (state, action) => {
      const { payload } = action;
      state.conditionDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    setALlInitDDL: (state, action) => {
      const { payload } = action;
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
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
