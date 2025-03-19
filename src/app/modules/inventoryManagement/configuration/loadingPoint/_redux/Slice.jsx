import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
  empDDL: [],
  designationDDL: [],
  identityDDL: [],
  bloodGroupDDL: [],
  userGroupDDL: [],
  gridData: [],
  singleData: "",
};

export const LoadingPointSlice = createSlice({
  name: "LoadingPoint",
  initialState: initState,
  reducers: {

    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },
    SetDesignationDDL: (state, action) => {
      const { payload } = action;
      state.designationDDL = payload;
    },
    SetIdentityTypeDDL: (state, action) => {
      const { payload } = action;
      state.identityDDL = payload;
    },
    SetBloodGroupDDL: (state, action) => {
      const { payload } = action;
      state.bloodGroupDDL = payload;
    },
    SetUserGroupDDL: (state, action) => {
      const { payload } = action;
      state.userGroupDDL = payload;
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

