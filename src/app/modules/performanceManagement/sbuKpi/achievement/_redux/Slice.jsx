import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  objective: [],
  target: [],
  singleData: "",
};

export const indPmsAchievementSlice = createSlice({
  name: "indPmsAchievement",
  initialState: initState,
  reducers: {
    SetTarget: (state, action) => {
      const { payload } = action;
      state.target = payload;
    },

    SetObjective: (state, action) => {
      const { payload } = action;
      state.objective = payload;
    },
    SetTargetEmpty: (state) => {
      state.target = [];
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
  },
});
