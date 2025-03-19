import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  empDDL: [],
  gridData: [],
  singleData: "",
  costCenterTypeDDL: [],
  costCenterGroupDDL: [],
  profitCenterDDL: [],
 
};

export const costCenterSlice = createSlice({
  name: "costCenter",
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
    }
    ,
    SetCostCenterTypeDDL: (state, action) => {
      const { payload } = action;
      state.costCenterTypeDDL = payload;
    },
    SetCostCenterGroupDDL: (state, action) => {
      const { payload } = action;
      state.costCenterGroupDDL = payload;
    },
    SetProfitCenterDDL: (state, action) => {
      const { payload } = action;
      state.profitCenterDDL = payload;
    },

    
  }
});

