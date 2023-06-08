import { createSlice } from "@reduxjs/toolkit";

const initState = {
  chartTypeDDL: [],
  monthDDL: [],
};

export const performanceChartTwoSlice = createSlice({
  name: "performanceChartTwo",
  initialState: initState,
  reducers: {
    SetChartTypeDDL: (state, action) => {
      const { payload } = action;
      state.chartTypeDDL = payload;
    },

    SetMonthDDL: (state, action) => {
      const { payload } = action;
      state.monthDDL = payload;
    },
  },
});
