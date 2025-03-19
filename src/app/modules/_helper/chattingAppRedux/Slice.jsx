import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUserForChat: null,
  signalRConnection: null,
  notifyCount: 0,
  msgNotifyCount: 0,
};

export const chattingAppSlice = createSlice({
  name: "chattingApp",
  initialState: initialState,
  reducers: {
    setSelectedUserForChat: (state, action) => {
      const { payload } = action;
      state.selectedUserForChat = payload;
    },
    resetSelectedUserForChat: (state, action) => {
      state.selectedUserForChat = null
    },
    setSignalRConnection: (state, action) => {
      state.signalRConnection = action.payload;
    },
    setNotifyCount: (state, action) => {
      state.notifyCount = action.payload;
    },
    setMsgNotifyCount: (state, action) => {
      state.msgNotifyCount = action.payload;
    },
  },
});
