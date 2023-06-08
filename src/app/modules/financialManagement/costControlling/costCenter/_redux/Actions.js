import * as requestFromServer from "./Api";
import { costCenterSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = costCenterSlice;

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      const ddlTemp = [];
      data.forEach((itm) => {
        const items = {
          value: itm.value,
          label: itm.label,
        };
        ddlTemp.push(items);
      });
      return dispatch(slice.SetEmpDDL(ddlTemp));
    }
  });
};

// Save Controlling Unit into DB
export const saveControllingUnit = (payload) => () => {
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
export const saveEditedControllingUnit = (payload, setDisabled) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
     
        toast.success("Submitted successfully");
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
export const getControllingUnitData = (
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

// getCostCenterById action for get single data by id
export const getCostCenterById = (id, accId, buid) => (dispatch) => {
  return requestFromServer
    .getDataById(id, accId, buid)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item.responsiblePerson,
            label: item.responsiblePersonName,
          },
          sbu: {
            value: item.sbuid,
            label: item.sbuName,
          },
          cu: {
            value: item.controllingUnitId,
            label: item.controllingUnitName,
          },
          costCenterType: {
            value: item.costCenterTypeId,
            label: item.costCenterTypeName,
          },
          ccGroupName: {
            value: item.costCenterGroupId,
            label: item.costCenterGroupName,
          },
          profitCenter: {
            value: item.profitCenterId,
            label: item.profitCenterName,
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

export const getCostCenterTypeDDLAction = (accId, buId, cuId) => (dispatch) => {
  return requestFromServer
    .getCostCenterTypeDDLData(accId, buId, cuId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const ddlTemp = [];
        data.forEach((itm) => {
          const items = {
            value: itm.id,
            label: itm.name,
          };
          ddlTemp.push(items);
        });
        return dispatch(slice.SetCostCenterTypeDDL(ddlTemp));
      }
    });
};
export const getCostCenterGroupDDLAction = (accId, buId, cuId) => (
  dispatch
) => {
  return requestFromServer
    .getCostCenterGroupDDLApiData(accId, buId, cuId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const ddlTemp = [];
        data.forEach((itm) => {
          const items = {
            value: itm.id,
            label: itm.name,
          };
          ddlTemp.push(items);
        });
        return dispatch(slice.SetCostCenterGroupDDL(ddlTemp));
      }
    });
};
export const getProfitCenterDDLAction = (accId, buId, cuId) => (dispatch) => {
  return requestFromServer
    .getProfitCenterDDLApiData(accId, buId, cuId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const ddlTemp = [];
        data.forEach((itm) => {
          const items = {
            value: itm.id,
            label: itm.name,
          };
          ddlTemp.push(items);
        });
        return dispatch(slice.SetProfitCenterDDL(data));
      }
    });
};
