import * as requestFromServer from "./Api";
import { corporateInDividualBalancedScoreSlice } from "./Slice";
const { actions: slice } = corporateInDividualBalancedScoreSlice;

export const getEmployeeDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetEmployeeDDL(data));
    }
  });
};
export const getDepartmentDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getDepartmentDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDepartmentDDL(data));
    }
  });
};
export const getSbuDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSbuDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSbuDDL(data));
    }
  });
};

// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
