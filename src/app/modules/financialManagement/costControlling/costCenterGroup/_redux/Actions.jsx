import * as requestFromServer from "./Api";
import { costCenterGroupSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = costCenterGroupSlice;

// Group Parent ddl get action
export const getGroupParentDDL = (accId, buId, cuId) => (dispatch) => {
  return requestFromServer.GetGroupParentDDL(accId, buId, cuId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetGroupParentDDL(data));
    }
  });
};

// Save Controlling Unit into DB
export const saveCreatedCostCenterGroup = (payload) => () => {
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
// Save Edited Controlling Unit into DB
export const saveEditedCostCenterGroup = (payload, setDisabled) => () => {
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
export const getCostCenterGroupGridData = (
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
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
     
    });
};

// Controlling unit action for get single data by id
export const getCostCenterGroupById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          controllingUnit: {
            value: item.controllingUnitId,
            label: item.controllingUnitName,
          },
          costCenterGroupParent: {
            value: item.costCenterGroupParantId,
            label: item.costCenterGroupParantName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// Controlling unit single to empty
export const setCostCenterGroupSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
