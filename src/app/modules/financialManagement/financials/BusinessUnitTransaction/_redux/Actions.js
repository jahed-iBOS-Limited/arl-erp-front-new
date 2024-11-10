import * as requestFromServer from "./Api";
import { costControllingUnitSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = costControllingUnitSlice;

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
       dispatch(slice.SetEmpDDL(data));
    }
  });
};

// action for save created data
export const saveControllingUnit = (payload) => () => {
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
// action for save edited data
export const saveEditedControllingUnit = (payload) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getControllingUnitGridData = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// action for get data by id single
export const getControllingUnitById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item.responsiblePerson,
            label: item.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
