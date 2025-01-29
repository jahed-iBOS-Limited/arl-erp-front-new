// import * as requestFromServer from "./Api";
import { chatAppSlice } from "./Slice";
const { actions: slice } = chatAppSlice;

export const setCurrentChatUserAction = (payload) => (dispatch) => {
  dispatch(slice.setCurrentChatUser(payload));
};

export const setCurrentChatUserEmptyAction = () => (dispatch) => {
  dispatch(slice.setCurrentChatUserEmpty());
};

export const setNotificationsAction = (payload) => (dispatch) => {
  dispatch(slice.setNotifications(payload));
};
