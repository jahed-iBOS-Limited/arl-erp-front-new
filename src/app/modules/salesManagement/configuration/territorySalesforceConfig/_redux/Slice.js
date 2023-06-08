import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  empDDL: [],
  territoryTypeDDL: [],
  territoryDDL: [],
  gridData: [],
  singleData: "",
};

export const saleForceTerriotryConfigSlice = createSlice({
  name: "salesForceTerritoryConig",
  initialState: initState,
  reducers: {

    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },
    SetTerriotroyDDL: (state, action) => {
      const { payload } = action;
      state.territoryDDL = payload;
    },
    SetterritoryTypeDDL: (state, action) => {
      const { payload } = action;
      state.territoryTypeDDL = payload;
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

