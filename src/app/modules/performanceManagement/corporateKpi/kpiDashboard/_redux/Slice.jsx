import { createSlice } from '@reduxjs/toolkit';

const initState = {
  isLoading: false,
  error: '',
  msg: '',
  unPavDDL: [],
  reportData: [],
};

export const coporateKpiDeshboardSlice = createSlice({
  name: 'coporateKpiDeshboard',
  initialState: initState,
  reducers: {
    SetunPavDDL: (state, action) => {
      const { payload } = action;
      state.unPavDDL = payload;
    },

    SetSingleStoreEmpty: (state) => {
      state.singleData = '';
    },
    SetReportData: (state, action) => {
      const { payload } = action;
      state.reportData = payload;
    },
    SetReportEmpty: (state) => {
      state.reportData = [];
    },
  },
});
