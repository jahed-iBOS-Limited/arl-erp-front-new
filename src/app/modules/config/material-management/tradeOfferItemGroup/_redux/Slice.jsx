import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  gridData: [],
  singleData: "",
};

export const tradeOfferItemGroupSlice = createSlice({
  name: "tradeOfferItemGroup",
  initialState: initState,
  reducers: {

    

    
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    
    SetSingleData: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    
    SetSingleStoreEmpty: (state, action) => {
      
      state.singleData = "";
    },

  }
});

