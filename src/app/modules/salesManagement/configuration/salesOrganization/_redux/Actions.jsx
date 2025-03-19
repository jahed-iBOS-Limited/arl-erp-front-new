import * as requestFromServer from "./Api";
import { salesOrganizationSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = salesOrganizationSlice;

// Save Sales Organization into DB
export const saveSalesOrganization = (payload, setDisabled) => () => {
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
// Save Edited Sales Organization into DB
export const saveExtendSalesOrganizationData = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// Controlling unit action for get data of table
export const getSOGridData = (accId, setLoading, buId, pageNo, pageSize) => (
  dispatch
) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
     
    });
};

// business unit sales organization for get single data by id
export const getSalesOrganizationById = (accId, id, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true)
  return requestFromServer
    .getDataById(accId, id)
    .then((res) => {
      setDisabled && setDisabled(false)
      if (res.status === 200 && isArray(res?.data)) {
        return dispatch(slice.SetDataById(res?.data?.[0]));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false)
    });
};

// Controlling unit single to empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
