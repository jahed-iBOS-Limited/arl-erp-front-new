import * as requestFromServer from "./Api";
import { taxPriceSetupSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = taxPriceSetupSlice;

// action for getting tax item name
export const getTaxItemNameDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getTaxItemNameDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetTaxItemNameDDL(data));
    }
  });
};

// action for getSupplyTypeDDL
export const getSupplyTypeDDL_Action = () => (dispatch) => {
  return requestFromServer.getSupplyTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setSupplyTypeDDL(data));
    }
  });
};

// action for getting mat Item Name
export const getMatItemNameDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getMatItemNameDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetMatItemNameDDL(data));
    }
  });
};

// action for getting value addition
export const getValueAdditionDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getValueAdditionDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetValueAdditionDDL(data));
    }
  });
};

// action for save created data
export const saveTaxPriceSetup = (payload, cb, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveTaxPriceSetup",
        });
        cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for save edited data
export const saveEditedTaxPriceSetupData = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveEditedTaxPriceSetupData",
        });
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
export const getPriceSetupGridData = (accId, buId, setLoading, pageNo, pageSize,search) => (
  dispatch
) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize,search)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
     
      setLoading(false);
    });
};
