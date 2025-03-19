import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  gridData: [],
  singleData: "",
  dimensionType: [],
};

export const pmsDimensionTwoSlice = createSlice({
  name: "pmsDimensionTwo",
  initialState: initState,
  reducers: {
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDimensionType: (state, action) => {
      const { payload } = action;
      state.dimensionType = payload;
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
