import * as requestFromServer from "./Api";
import { pmsDimensionTwoSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = pmsDimensionTwoSlice;

// action for save created data
export const savePmsDimensionAction = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
    });
};

// action for get grid data
export const getPmsDimensionGridData = (accId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};

export const getDimensionTypeAction = () => (dispatch) => {
  return requestFromServer
    .getDimensionType()
    .then((res) => {
      return dispatch(slice.SetDimensionType(res.data));
    })
    .catch((err) => {
     
    });
};

