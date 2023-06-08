import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: '',
  msg: "",
};

export const costControllingUnitSlice = createSlice({
  name: "costControllingUnit",
  initialState: initState,
  reducers: {

    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },

  }
});

