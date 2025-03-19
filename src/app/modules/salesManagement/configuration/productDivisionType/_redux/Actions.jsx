import * as requestFromServer from "./Api";
import { productDivisionTypeSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = productDivisionTypeSlice;

// action for save created data
export const saveProductDivisionType = (payload, setDisabled) => () => {
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
export const saveEditedProductDivisionType = (payload, setDisabled) => () => {
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
      setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getProductDivitionTypeGridData = (
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
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
    });
};

// action for get data by id single
export const getProductDivisionById = (id, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true);
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      setDisabled && setDisabled(false);
      if (res.status === 200 && isArray(res?.data)) {
        const item = res?.data?.[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item?.responsiblePerson,
            label: item?.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false);
    });
};
// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
