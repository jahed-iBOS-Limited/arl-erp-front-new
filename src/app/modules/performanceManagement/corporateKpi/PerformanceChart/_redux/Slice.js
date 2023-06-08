import { createSlice } from "@reduxjs/toolkit";

const initState = {
  chartTypeDDL: [],
  monthDDL: [],
};

export const corporatePerformanceChartSlice = createSlice({
  name: "corporatePerformanceChart",
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
