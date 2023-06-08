import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  empDDL: [],
  shippointDDL: [],
  pendingOrderGridData: [],
};

export const pendingOrderSlice = createSlice({
  name: "pendingOrder",
  initialState: initState,
  reducers: {
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },

    SetShippointDDL: (state, action) => {
      const { payload } = action;
      state.shippointDDL = payload;
    },
    setPendingOrderGridDataEmpty: (state) => {
      state.pendingOrderGridData = [];
    },
    SetPendingOrderGridData: (state, action) => {
      const { payload } = action;
      state.pendingOrderGridData = payload;
    },
  },
});
