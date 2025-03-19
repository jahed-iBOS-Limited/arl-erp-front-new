import * as requestFromServer from "./Api";
import { ProductDivisionSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = ProductDivisionSlice;

export const getProductDivisionTypeDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getProductDivisionTypeDDL(accId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data && data.length > 0) {
        return dispatch(slice.SetProductDivisionTypDDL(data));
      }
    });
};

export const getParentDivisionTypeDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getParentDivisionDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      //console.log(data)
      return dispatch(slice.SetParentDivisionTypeDDL(data));
    }
  });
};

// Save ProductDivision into DB
export const saveProductDivision = (payload, setDisabled) => () => {
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
// Save Edited ProductDivision into DB
export const saveEditProductDivision = (payload, setDisabled) => () => {
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
// ProductDivision action for get data of table
export const getGridDataAction = (
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

// ProductDivision action for get single data by id
export const getProductDivisionChannelById = (accId, buId, id, setDisabled) => (
  dispatch
) => {
  setDisabled && setDisabled(true);
  return requestFromServer
    .getDataById(accId, buId, id)
    .then((res) => {
      setDisabled && setDisabled(false);
      if (res.status === 200 && isArray(res?.data)) {
        const item = res?.data?.[0];
        const data = {
          ...item,
          productDivisionType: {
            value: item?.productDivisionTypeId,
            label: item?.productDivisionType,
          },
          parentDivisionName: {
            value: item?.parentDivisionId,
            label: item?.parentDivisionName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false);
    });
};
// ProductDivision single to empty
export const setProductDivisionSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
