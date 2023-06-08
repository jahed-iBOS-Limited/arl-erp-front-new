import * as requestFromServer from "./Api";
import { profitCenterSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = profitCenterSlice;

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetEmpDDL(data));
    }
  });
};

export const getGroupNameDDLAction = (accId, buId, cuid) => (dispatch) => {
  return requestFromServer.getGroupNameDDL(accId, buId, cuid).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetGroupNameDDL(data));
    }
  });
};
// Save ProfitCenter into DB
export const saveProfitCenter = (payload) => () => {
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
// Save Edited ProfitCenter into DB
export const saveEditedProfitCenter = (payload, setDisabled) => () => {
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
// ProfitCenter action for get data of table
export const getProfitCenterGridData = (accId, buId, pageNo, pageSize) => (
  dispatch
) => {
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
     
    });
};
// ProfitCenter action for get single data by id
export const getProfitCenterById = (id) => (dispatch) => {
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
          groupName: {
            value: item.profitCenterGroupId,
            label: item.profitCenterGroupName,
          },
          responsiblePerson: {
            value: item.responsiblePersonId,
            label: item.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// ProfitCenter single to empty
export const setProfitCenterSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
