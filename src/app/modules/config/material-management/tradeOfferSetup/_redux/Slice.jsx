import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  gridData: [],
  conditionTypeDDL: [],
  roundingTypeDDL: [],
  itemListDDL: [],
  itemGroupDDL: [],
  salesDDL: [],
  distributionDDL: [],
  salesTerritoryDDL: [],
  partnerDDL: []
};

export const tradeOfferSlice = createSlice({
  name: "tradeOffer",
  initialState: initState,
  reducers: {

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetConditionTypeDDL: (state, action) => {
      const { payload } = action;
      state.conditionTypeDDL = payload;
    },

    SetRoundingTypeDDL: (state, action) => {
      const { payload } = action;
      state.roundingTypeDDL = payload;
    },

    SetAllDDL: (state, action) => {
      const { payload } = action;
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]?.data;
      })
    },

    SetSingleStoreEmpty: state => {
      state.singleData = "";
    },

  }
});

