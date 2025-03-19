/* eslint-disable no-unused-vars */
import * as requestFromServer from "./Api";
import { toast } from "react-toastify";
import { adInternalExp } from "./Slice";
const { actions: slice } = adInternalExp;

// // getSBUDDL
export const setSelectedSBU_action = (value) => (dispatch) => {
  dispatch(slice.setSelectedSBU(value));
};

export const saveAdvanceExpJournal_Action = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};

// action for get grid data
export const getAdvanceExpGridData = (
  accId,
  buId,
  sbuId,
  cuId,
  empId,
  isApproved,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, sbuId, cuId, empId, isApproved, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      slice.SetGridData([]);
      setLoading(false);
    });
};
//  setGridDataEmpty_action
export const SetGridDataEmpty_action = () => (dispatch) => {
  return dispatch(slice.SetGridDataEmpty());
};

export const saveEditedAdvanceExpGridData = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveEditData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};

export const saveCashReceiveData_Action = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCashReceiveData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
