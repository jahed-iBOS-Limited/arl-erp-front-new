import * as requestFromServer from "./Api";
import { shippingPointSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = shippingPointSlice;

export const getWarehouseDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getWarehouseDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      return dispatch(slice.SetWarehouseDDL(data));
    }
  });
};
// action for save created data
export const saveShippingPoint = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for save edited data
export const saveExtendShippingPoint = (payload, back, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveExtendData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
        back();
        setDisabled(false);
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for get grid data
export const getShippingPoint = (accId, buId, setLoading, pageNo, pageSize,search) => (
  dispatch
) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize,search)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
     
      setLoading(false);
    });
};
// action for get data by id single
export const getShippingPointById = (id) => (dispatch) => {
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
export const setShippingPointSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
