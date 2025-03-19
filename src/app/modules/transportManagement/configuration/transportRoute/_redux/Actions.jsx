import * as requestFromServer from "./Api";
import { transportRouteSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = transportRouteSlice;

export const getTZDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getTZDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetTZDDL(data));
    }
  });
};
// action for save created data
export const saveTransportRoute = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
     
      setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedTransportRouteData = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getTransportRouteData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
     
    });
};
// action for get data by id single
export const getTransportRouteById = (id) => (dispatch) => {
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
// getViewModalData action for get view modal data
export const getViewModalData = (id) => (dispatch) => {
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
        return dispatch(slice.SetViewModalData(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setTransportRouteSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
