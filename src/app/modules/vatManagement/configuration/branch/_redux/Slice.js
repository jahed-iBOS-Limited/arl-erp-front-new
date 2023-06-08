import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  buDDL: [],
  countryDDL: [],
  divisionDDL: [],
  districtDDL: [],
  policeStationDDL: [],
  postCodeDDL: [],
  gridData: {},
  singleData: "",
};

export const taxBranchSlice = createSlice({
  name: "taxBranch",
  initialState: initState,
  reducers: {
    SetBuDDL: (state, action) => {
      const { payload } = action;
      state.buDDL = payload;
    },
    SetCountryDDL: (state, action) => {
      const { payload } = action;
      state.countryDDL = payload;
    },
    SetDivisionDDL: (state, action) => {
      const { payload } = action;
      state.divisionDDL = payload;
    },
    SetDistrictDDL: (state, action) => {
      const { payload } = action;
      state.districtDDL = payload;
    },
    SetPoliceStationDDL: (state, action) => {
      const { payload } = action;
      state.policeStationDDL = payload;
    },
    SetPostCodeDDL: (state, action) => {
      const { payload } = action;
      state.postCodeDDL = payload;
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

