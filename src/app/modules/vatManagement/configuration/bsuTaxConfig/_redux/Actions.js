import * as requestFromServer from "./Api";
import { buTaxConfigSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = buTaxConfigSlice;

// action for get grid data
export const getBuTaxConfigGridData = (accId, buId, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true)
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      if (res.status === 200 && res?.data?.data) {
        const data = res?.data?.data;
        setDisabled && setDisabled(false)
        return dispatch(slice.SetGridData(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false)
    });
};

// action for save created data
export const saveBuTaxConfigAction = (payload, setDisabled) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        payload.createBuTaxInfo(payload?.values);
        // toast.success(res.data?.message || "Submitted successfully", {
        //   toastId: "saveBuTaxConfigAction",
        // });
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
    
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
