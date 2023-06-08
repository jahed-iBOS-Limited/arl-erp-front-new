import * as requestFromServer from "./Api";
import { profitCenterGroupSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";

const { actions: slice } = profitCenterGroupSlice;

export const getGroupParentDDLAction = (accId, buId, cuId) => (dispatch) => {
  return requestFromServer.GetGroupParentDDL(accId, buId, cuId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetGroupParentDDL(data));
    }
  });
};

// Save ProfitCenter Gorup into DB
export const saveProfitCentedGroup = (payload) => () => {
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
// Save Edited ProfitCenter Gorup into DB
export const saveEditedControllingUnit = (payload, setDisabled) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
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
// ProfitCenter Gorup  action for get data of table
export const getProfitCenterGroupData = (
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

// ProfitCenter Gorup  action for get single data by id
export const getProfitCenterGroupDataById = (id) => (dispatch) => {
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
          profitCenterGroupParent: {
            value: item.profitCenterGroupParantId,
            label: item.profitCenterGroupParantName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// ProfitCenter Gorup  single to empty
export const setProfitCenterGroupDataSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
