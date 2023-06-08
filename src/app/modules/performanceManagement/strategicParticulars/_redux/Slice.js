import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  departmentDDL: [],
  strategicObjectiveTypeDDL: [],
  strategicParticularsTypeDDL: [],
  gridData: [],
  singleData: "",
  strategicParticularsGrid: "",
  strObjList: [],
  strTarget: []
};

export const strategicParticularsTwoSlice = createSlice({
  name: "strategicParticularsTwo",
  initialState: initState,
  reducers: {
    SetStrategicParticularsTypeDDL: (state, action) => {
      const { payload } = action;
      state.strategicParticularsTypeDDL = payload;
    },
    SetDepartmentDDL: (state, action) => {
      const { payload } = action;
      state.departmentDDL = payload;
    },
    SetStrTarget: (state, action) => {
      const { payload } = action;
      state.strTarget = payload;
    },
    SetStrObjList: (state, action) => {
      const { payload } = action;
      state.strObjList = payload;
    },
    SetStrategicObjectiveTypeDDLAction: (state, action) => {
      const { payload } = action;
      state.strategicObjectiveTypeDDL = payload;
    },
    SetStrategicParticularsGrid: (state, action) => {
      const { payload } = action;
      state.strategicParticularsGrid = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.strategicParticularsGrid = "";
    },
    SetSingleStoreEmpty_: state => {
      state.singleData = "";
    },
  },
});
