import * as requestFromServer from "./Api";
import { purchaseOrgSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = purchaseOrgSlice;

// Save PurchaseOrgData into DB
export const savePurchaseOrgData = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        payload.setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      payload.setDisabled(false);
     
      toast.error(err?.response?.data?.message);
    });
};
// Save Edited Controlling Unit into DB
export const saveEditedPurchaseOrg = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// PurchaseOrgData action for get data of table
export const getPurchaseOrgData = (
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
// PurchaseOrgData action for get single data by id
export const getPurchaseOrgById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        var item = res.data[0];
        item.organizationName = item.purchaseOrganization;
        return dispatch(slice.SetDataById(item));
      }
    })
    .catch((err) => {
     
    });
};
// sPurchaseOrg single to empty
export const setPurchaseOrgSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
