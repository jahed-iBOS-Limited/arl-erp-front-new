import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  codeTypeDDL: [],
  gridData: [],
  singleData: "",
};

export const codeGenerateSlice = createSlice({
  name: "codeGenerate",
  initialState: initState,
  reducers: {

    SetCodeTypeDDL: (state, action) => {
      const { payload } = action;
      state.codeTypeDDL = payload;
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

