import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  empDDL: [],
  gridData: [],
  singleData: "",
};

export const costControllingUnitSlice = createSlice({
  name: "costControllingUnit",
  initialState: initState,
  reducers: {

    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
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

