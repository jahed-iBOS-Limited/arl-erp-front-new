import * as requestFromServer from "./Api";
import { indPmsAchievementSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = indPmsAchievementSlice;

// action for save created data
export const saveAchievementAction = (payload) => () => {
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

export const getObjectiveAction = (accId, buId, empId, yearId) => (
  dispatch
) => {
  return requestFromServer
    .getObjective(accId, buId, empId, yearId)
    .then((res) => {
      return dispatch(slice.SetObjective(res.data));
    })
    .catch((err) => {
     
    });
};

export const getTargetAction = (kpiId, freqId, yearId) => (dispatch) => {
  return requestFromServer
    .getTarget(kpiId, freqId, yearId)
    .then((res) => {
      return dispatch(slice.SetTarget(res.data));
    })
    .catch((err) => {
     
    });
};

// set single store empty
export const setTargetEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetTargetEmpty());
};

// set single store empty
export const setCompetencySingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
