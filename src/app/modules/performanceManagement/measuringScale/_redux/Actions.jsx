import * as requestFromServer from "./Api";
import { measuringScaleTwoSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = measuringScaleTwoSlice;

export const getScaleForDDLAction = () => (dispatch) => {
  return requestFromServer.getScaleForDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetScaleForDDL(data));
    }
  });
};

// action for save created data
export const saveMeasuringScaleAction = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setRowDto([])
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
    });
};

// action for get grid data
export const getMeasuringScaleGridData = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};
