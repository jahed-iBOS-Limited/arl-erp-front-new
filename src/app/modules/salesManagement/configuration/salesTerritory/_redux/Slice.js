import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  gridData: [],
  viewModalData: [],
  territoryTypeDDL: [],
  parentTerritoryDDL: [],
  countryNameDDL: [],
  divisionDDL: [],
  districtDDL: [],
  thanaDDL: [],
  singleData: "",
};

export const salesTerritorySlice = createSlice({
  name: "salesTerritory",
  initialState: initState,
  reducers: {

    SetTerritoryTypeDDL: (state, action) => {
      const { payload } = action;
      state.territoryTypeDDL = payload;
    },

    SetParentTerritoryDDL: (state, action) => {
      const { payload } = action;
      state.parentTerritoryDDL = payload;
    },

    SetCountryNameDDL: (state, action) => {
      const { payload } = action;
      state.divisionDDL = []
      state.districtDDL = []
      state.thanaDDL = []
      state.countryNameDDL = payload;
    },

    SetDivisionDDL: (state, action) => {
      const { payload } = action;
      state.districtDDL = []
      state.thanaDDL = []
      state.divisionDDL = payload;
    },

    SetDistrictDDL: (state, action) => {
      const { payload } = action;
      state.thanaDDL = []
      state.districtDDL = payload;
    },

    SetThanaDDL: (state, action) => {
      const { payload } = action;
      state.thanaDDL = []
      state.thanaDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetViewModalData: (state, action) => {
      const { payload } = action;
      state.viewModalData = payload;
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

