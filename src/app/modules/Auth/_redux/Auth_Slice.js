import { createSlice } from "@reduxjs/toolkit";

const initAuthState = {
  isLoading: false,
  isAuth: false,
  error: "",
  msg: "",
  haveBusinessUnit: false,
  profileData: {},
  selectedBusinessUnit: { label: "", value: "" },
  businessUnitList: [],
  menu: [],
  chatAppInfo: "",
  tokenData: "",
  isExpiredToken: false,
  isExpiredPassword: false,
  isForceLogout: false,
  userRole: [],
  email: null,
  peopledeskApiURL: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const authSlice = createSlice({
  name: "authData",
  initialState: initAuthState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setExpiredPassword: (state, action) => {
      state.isExpiredPassword = action.payload;
    },
    setForceLogout: (state, action) => {
      state.isForceLogout = action.payload;
    },

    catchError: (state, action) => {
      state.msg = { color: "error", msg: "Login Failed" };
      // state.isAuth = false;
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
      const { isAuth, tokenData } = action.payload;
      state.isAuth = isAuth;
      state.msg = { color: "success", msg: "Login Successful" };
      state.tokenData = tokenData;
      state.isLoading = false;
      state.isExpiredToken = false;
    },
    ProfileFetched: (state, action) => {
      const { data } = action.payload;
      state.profileData = data[0];
      state.haveBusinessUnit = data[0]?.haveBusinessUnit;
    },
    LogOut: (state) => {
      return initAuthState;
    },
    SetBusinessUnitTrue: (state) => {
      state.msg = "";
      state.isAuth = true;
      state.haveBusinessUnit = true;
    },
    SetBusinessUnit: (state, action) => {
      const { payload } = action;
      let prevBusinessUnit = state.selectedBusinessUnit;
      state.selectedBusinessUnit = payload;
      // many forms input fields depend on business unit, that's why, if user change this unit, we will reload the whole project.
      prevBusinessUnit?.label &&
        setTimeout(() => window.location.reload(), 500);
    },
    SetBusinessUnitList: (state, action) => {
      const { payload } = action;
      state.businessUnitList = payload;
    },
    SetMenu: (state, action) => {
      const { payload } = action;
      state.menu = payload;
    },

    setChatInfo: (state, action) => {
      const { payload } = action;
      state.chatAppInfo = payload;
    },
    setIsExpiredToken: (state, action) => {
      const { payload } = action;
      state.isExpiredToken = payload;
    },
    setIsToken: (state, action) => {
      const { payload } = action;
      state.tokenData = payload;
    },
    setPeopledeskApiURL: (state, action) => {
      const { payload } = action;
      state.peopledeskApiURL = payload;
    },
  },
});
