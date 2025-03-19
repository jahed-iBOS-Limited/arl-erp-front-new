import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  empDDL: [],
  yearDDL: [],
  objectiveDDL: [],
  bscPerspectiveDDL: [],
  weightDDL: [],
  scaleForValueDDL: [],
  measuringScale: [],
  measuringScaleButtom: [],
  gridData: [],
  singleData: "",
  employeeBasicInfo: "",
  empInfo: "",
  empSupDDL: [],
  competencyList: [],
  valuesList: [],
  valAndCompByEmpId: null,
  valuesPopUp: [],
  competencyPopUp: [],
  reportData: [],
  strategicParticularsGrid: "",
  individualKpiEditedSingleData: "",
  dataSourceDDL: [],
  unFavDepSbuDDL: [],
  newKpiReport: [],
};

export const performanceMgtSlice = createSlice({
  name: "performanceMgt",
  initialState: initState,
  reducers: {
    SetStrategicParticularsGrid: (state, action) => {
      const { payload } = action;
      state.strategicParticularsGrid = payload;
    },

    SetunFavDepSbuDDL: (state, action) => {
      const { payload } = action;
      state.unFavDepSbuDDL = payload;
    },
    SetStrategicParticularsEmpty: (state) => {
      state.strategicParticularsGrid = "";
    },
    SetIndividualKpiEditedSingleData: (state, action) => {
      const { payload } = action;
      state.individualKpiEditedSingleData = payload;
    },
    SetDataSourceDDL: (state, action) => {
      const { payload } = action;
      state.dataSourceDDL = payload;
    },
    SetValAndCompByEmpId: (state, action) => {
      const { payload } = action;
      state.valAndCompByEmpId = payload;
    },
    SetValAndCompByEmpIdEmpty: (state, action) => {
      state.valAndCompByEmpId = null;
    },
    SetEmpInfo: (state, action) => {
      const { payload } = action;
      state.empInfo = payload;
    },
    SetValuesPopUp: (state, action) => {
      const { payload } = action;
      state.valuesPopUp = payload;
    },
    SetCompetencyPopUp: (state, action) => {
      const { payload } = action;
      state.competencyPopUp = payload;
    },
    SetValuesList: (state, action) => {
      const { payload } = action;
      state.valuesList = payload;
    },
    SetValuesListEmpty: (state, action) => {
      state.valuesList = [];
    },
    SetMeasuringScale: (state, action) => {
      const { payload } = action;
      state.measuringScale = payload;
    },
    SetMeasuringScaleButtom: (state, action) => {
      const { payload } = action;
      state.measuringScaleButtom = payload;
    },
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },
    SetYearDDL: (state, action) => {
      const { payload } = action;
      const modifyDDL = payload?.map((item, index) => ({
        ...item,
        index,
      }));
      state.yearDDL = modifyDDL;
    },
    SetEmpSupDDL: (state, action) => {
      const { payload } = action;
      state.empSupDDL = payload;
    },
    SetCompetencyList: (state, action) => {
      const { payload } = action;
      state.competencyList = payload;
    },
    SetCompetencyEmpty: (state, action) => {
      state.competencyList = [];
    },
    SetObjectiveDDL: (state, action) => {
      const { payload } = action;
      state.objectiveDDL = payload;
    },
    SetWeightDDL: (state, action) => {
      const { payload } = action;
      state.weightDDL = payload;
    },
    SetScaleForValueDDL: (state, action) => {
      const { payload } = action;
      state.scaleForValueDDL = payload;
    },
    SetBscPerspectiveDDL: (state, action) => {
      const { payload } = action;
      state.bscPerspectiveDDL = payload;
    },

    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    SetEmployeeBasicInfoById: (state, action) => {
      const { payload } = action;
      state.employeeBasicInfo = payload;
    },
    SetEmployeeBasicInfoEmpty: (state) => {
      state.employeeBasicInfo = "";
    },
    SetReportData: (state, action) => {
      const { payload } = action;
      state.reportData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
    SetReportEmpty: (state) => {
      state.reportData = [];
    },
    SetNewKpiReport: (state, action) => {
      const { payload } = action;
      state.newKpiReport = payload;
    },
    SetNewKpiReportEmpty: (state) => {
      state.newKpiReport = [];
    },
  },
});
