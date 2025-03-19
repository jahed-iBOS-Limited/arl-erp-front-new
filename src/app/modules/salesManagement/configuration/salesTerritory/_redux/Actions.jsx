import * as requestFromServer from "./Api";
import { salesTerritorySlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = salesTerritorySlice;

// action for save created data
export const saveSalesTerritory = (payload, setDisabled) => () => {
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
export const saveEditedSalesTerritory = (payload, setDisabled) => () => {
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

// action for get grid data
export const getSalesTerritoryGridData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
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

// action for get view modal data
export const getViewModalData = (territoryId) => (dispatch) => {
  return requestFromServer
    .getViewModalData(territoryId)
    .then((res) => {
      return dispatch(slice.SetViewModalData(res.data));
    })
    .catch((err) => {
     
    });
};

// action for get data by id single
export const getSalesTerritoryById = (id, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true)
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      setDisabled && setDisabled(false)
      if (res.status === 200 && isArray(res.data)) {
        const item = res?.data?.[0];
        const data = {
          ...item,
          territoryTypeName: {
            value: item?.territoryTypeId,
            label: item?.territoryTypeName,
          },
          parentTerritoryName: {
            value: item?.parentTerritoryId,
            label: item.parentTerritoryName,
          },
          countryName: {
            value: item?.countryId,
            label: item?.countryName,
          },
          divisionName: {
            value: item?.division,
            label: item?.divisionName,
          },
          distirctName: {
            value: item?.distirct,
            label: item?.distirctName,
          },
          thanaName: {
            value: item?.thana,
            label: item?.thanaName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false)
    });
};

// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// territory type ddl
export const getTerritoryTypeDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getTerritoryTypeDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetTerritoryTypeDDL(res.data));
    }
  });
};

// getParentTerritoryDDL ddl
export const getParentTerritoryDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getParentTerritoryDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetParentTerritoryDDL(res.data));
    }
  });
};

// getCountryDDLLAction
export const getCountryDDLLAction = () => (dispatch) => {
  requestFromServer.getCountryDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCountryNameDDL(res.data));
    }
  });
};

// getDivisionDDLAction
export const getDivisionDDLAction = (countryId) => (dispatch) => {
  requestFromServer.getDivisionDDL(countryId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDivisionDDL(res.data));
    }
  });
};

// getDistrictDDLAction
export const getDistrictDDLAction = (countryId, divisionId) => (dispatch) => {
  requestFromServer.getDistrictDDL(countryId, divisionId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDistrictDDL(res.data));
    }
  });
};

// getThanaDDLAction
export const getThanaDDLAction = (countryId, divisionId, districtId) => (
  dispatch
) => {
  requestFromServer
    .getThanaDDL(countryId, divisionId, districtId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newData = res?.data?.map((item) => ({
          ...item,
          label: `${item?.label} [P.C. ${item?.code}]`,
        }));

        dispatch(slice.SetThanaDDL(newData));
      }
    });
};
