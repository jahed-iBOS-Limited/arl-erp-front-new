import * as requestFromServer from "./Api";
import { saleForceTerriotryConfigSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = saleForceTerriotryConfigSlice;

// get Employee DDL Action
export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      dispatch(slice.SetEmpDDL(data));
    }
  });
};

// get getTerritoryTypeDDLAction
export const getTerritoryTypeDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getTerritoryTypeDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      dispatch(slice.SetterritoryTypeDDL(data));
    }
  });
};

// get getTerritoryDDLAction
export const getTerritoryDDLAction = (accId, buId, typeId) => (dispatch) => {
  return requestFromServer.getTerritoryDDL(accId, buId, typeId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      dispatch(slice.SetTerriotroyDDL(data));
    }
  });
};

// action for save created data
export const saveSaleForceTerritory = (payload, setDisabled) => () => {
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
export const saveEditedSaleForceTerritory = (payload, setDisabled) => () => {
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
export const getSaleForceTerritoryGridData = (
  accId,
  buId,
  data,
  setLoading,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, data, pageNo, pageSize,search)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
     
    });
};

// action for get data by id single
export const getSaleForceTerritoryById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res?.data[0];
        const data = {
          ...item,
          territoryType: {
            value: item?.objHeader?.territoryTypeId,
            label: item?.objHeader?.territoryTypeName,
          },
          territory: {
            value: item?.objHeader?.territoryId,
            label: item?.objHeader?.territoryName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setSalesForceTerritorySingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
