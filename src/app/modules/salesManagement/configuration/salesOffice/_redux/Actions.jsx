import * as requestFromServer from "./Api";
import { salesOfficeSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
import Axios from "axios";
const { actions: slice } = salesOfficeSlice;

// action for save created data
export const saveSalesOffice = (payload, setDisabled) => () => {
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
     
      setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedSalesOffice = (payload, setDisabled) => () => {
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
export const getSalesOfficeGridData = (
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
// action for get data by id single
export const getSalesOfficeById = (id, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true)
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      setDisabled && setDisabled(false)
      if (res.status === 200 && isArray(res?.data)) {
        const item = res?.data?.[0];
        const data = {
          ...item,
          salesOrganization: item?.salesOrganizationId ? {
            value: item?.salesOrganizationId,
            label: item?.salesOrganizationName,
          } : "",
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false)
    });
};
// set single store empty
export const setSalesOfficeSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

export const getSalesOrgDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationByUnitIdDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data.map((itm) => {
        return {
          ...itm,
          value: itm?.value,
          label: itm?.label,
          // name: itm?.label
        };
      });
      setter(data);
    }
  } catch (error) {
    
  }
};
