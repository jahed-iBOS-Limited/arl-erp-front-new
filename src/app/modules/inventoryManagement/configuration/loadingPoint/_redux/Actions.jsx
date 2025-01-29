import * as requestFromServer from "./Api";
import { LoadingPointSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = LoadingPointSlice;

export const getDesignationDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getDesignationDDLApi(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      return dispatch(slice.SetDesignationDDL(data));
    }
  });
};

// Save Controlling Unit into DB
export const saveDepartment = (payload, setDisabled) => () => {
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
// Save Edited Controlling Unit into DB
export const saveEditDepartment = (payload, setDisabled) => () => {
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
export const getGridData = (accId, buId, setLoading, pageNo, pageSize,search) => (
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

// Controlling unit action for get single data by id
export const getDepartmentByIdAction = (accId, buId, id) => (dispatch) => {
  return requestFromServer
    .getDataById(accId, buId, id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,

          shipPointName: {
            value: item.shipPointId,
            label: item.shipPointName,
          },
        };

        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// Controlling unit single to empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
