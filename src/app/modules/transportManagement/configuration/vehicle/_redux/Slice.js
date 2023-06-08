import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  vehicleTypeDDL: [],
  employeeListDDL: [],
  transportModeDDL: [],
  vehicleUsePurposeDDL: [],
  gridData: [],
  singleData: "",
};

export const vehicleUnitSlice = createSlice({
  name: "vehicleUnit",
  initialState: initState,
  reducers: {

    SetVehicleTypeDDL: (state, action) => {
      const { payload } = action;
      state.vehicleTypeDDL = payload;
    },

    SetFuelTypeDDL: (state, action) => {
      const { payload } = action;
      state.fuelTypeDDL = payload;
    },

    SetVehicleCapacityDDL: (state, action) => {
      const { payload } = action;
      state.vehicleCapacityDDL = payload;
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

    SetEmployeeListDDL: (state, action) => {
      const { payload } = action;
      state.employeeListDDL = payload;
    },
    SetTransportModeDDL: (state, action) => {
      const { payload } = action;
      state.transportModeDDL = payload;
    },
    SetVehicleUsePurposeDDL: (state, action) => {
      const { payload } = action;
      state.vehicleUsePurposeDDL = payload;
    }
  }
});

