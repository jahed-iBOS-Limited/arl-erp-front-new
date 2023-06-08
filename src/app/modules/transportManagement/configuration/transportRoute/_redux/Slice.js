import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  TZDDL: [],
  gridData: [],
  singleData: "",
};

export const transportRouteSlice = createSlice({
  name: "transportRoute",
  initialState: initState,
  reducers: {
    SetTZDDL: (state, action) => {
      const { payload } = action;
      state.TZDDL = payload;
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
