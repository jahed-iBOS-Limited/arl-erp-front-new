import { createSlice } from "@reduxjs/toolkit";

const initState = {
  currentChatUser: "",
  notifications: {
    status: false,
    from: "",
  },
};

export const chatAppSlice = createSlice({
  name: "chatApp",
  initialState: initState,
  reducers: {
    setCurrentChatUser: (state, action) => {
      const { payload } = action;
      state.currentChatUser = payload;
    },
    setCurrentChatUserEmpty: (state, action) => {
      state.currentChatUser = "";
    },

    setNotifications: (state, action) => {
      const { payload } = action;
      state.notifications = payload;
    },
  },
});
