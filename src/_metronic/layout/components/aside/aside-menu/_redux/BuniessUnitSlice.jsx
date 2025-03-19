import { createSlice } from "@reduxjs/toolkit";

const initAuthState = {
  isLoading: false,
  isAuth: false,
  error: '',
  msg: "",
  haveBusinessUnit: false,
  profileData: {},
  menu: {}
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const authSlice = createSlice({
  name: "authData",
  initialState: initAuthState,
  reducers: {
    catchError: (state, action) => {
      state.msg = { color: "error", msg: "Login Failed" };
      state.isAuth = false;
      state.isLoading = false;
      state.isLoading = false;
    },
    startAuthCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.isLoading = true;
      } else {
        state.isLoading = true;
      }
    },
    LoginFetched: (state, action) => {
      const { isAuth } = action.payload;
      state.isAuth = isAuth;
      state.msg = { color: "success", msg: "Login Successful" };
      state.isLoading = false;
    },
    ProfileFetched: (state, action) => {
      const { data } = action.payload;
      state.isAuth = true
      state.profileData = data[0];
      state.haveBusinessUnit = data[0]?.haveBusinessUnit
    },
    LogOut: (state) => {
      state.msg = "";
      state.isAuth = false;
      state.haveBusinessUnit = false;
      state.profileData = {}
    },
    SetBusinessUnitTrue: (state) => {
      state.msg = "";
      state.isAuth = true;
      state.haveBusinessUnit = true;
    },
  }
});
