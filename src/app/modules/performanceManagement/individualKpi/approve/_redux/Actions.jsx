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
export const saveAproveKPI_api_action = (payload, callbackFunc, setLoading) => () => {
  setLoading && setLoading(true)
  return requestFromServer
    .saveAproveKPI_api(payload)
    .then((res) => {
      setLoading && setLoading(false)
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        callbackFunc && callbackFunc();
      }
    })
    .catch((err) => {
      setLoading && setLoading(false)
      toast.error(err?.response?.data?.message);
    });
};
export const saveRejectKPI_api_action = (payload, callbackFunc) => () => {
  return requestFromServer
    .saveRejectKPI_api(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        callbackFunc && callbackFunc();
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
    .catch((err) => {});
};

export const getTargetAction = (kpiId, freqId, yearId) => (dispatch) => {
  return requestFromServer
    .getTarget(kpiId, freqId, yearId)
    .then((res) => {
      return dispatch(slice.SetTarget(res.data));
    })
    .catch((err) => {});
};

// set single store empty
export const setTargetEmptyAction = () => async (dispatch) => {
  return dispatch(slice?.SetTargetEmpty());
};

// set single store empty
export const setCompetencySingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

export const getEmployeeSupervisorDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpSupDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      console.log(data);
      dispatch(slice.SetEmployeeSupDDL(data));
    }
  });
};
