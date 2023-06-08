import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  itemDDL: [],
  uomDDL: [],
  gridData: [],
  viewModalData: [],
  copyFromDDL: [],
  bomListData: [],
  netWeight: "",
  singleData: "",
};

export const billOfMaterialSlice = createSlice({
  name: "bom",
  initialState: initState,
  reducers: {
    SetItemDDL: (state, action) => {
      const { payload } = action;
      state.itemDDL = payload;
    },

    SetuomDDL: (state, action) => {
      const { payload } = action;
      state.uomDDL = payload;
    },

    SetcopyFromDDL: (state, action) => {
      const { payload } = action;
      state.copyFromDDL = payload;
    },

    SetnetWeight: (state, action) => {
      const { payload } = action;
      state.netWeight = payload;
    },

    SetbomListData: (state, action) => {
      const { payload } = action;
      state.bomListData = payload;
    },

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
  },
});
