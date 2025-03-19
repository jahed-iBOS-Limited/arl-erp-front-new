import * as requestFromServer from "./Api";
import { tradeOfferItemGroupSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = tradeOfferItemGroupSlice;

// save trade offer
export const saveTradeOfferItemGroup = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveTradeOfferItemGroup",
        });
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message, {
        toastId: "saveTradeOfferItemGroupError",
      });
      payload.setDisabled(false);
    });
};

// grid data
export const getTradeOfferItemGroupGridData = (
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

// Save edited data into DB
export const saveEditedTradeOfferItemGroup = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditedData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveEditedTradeOfferItemGroup",
        });
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message, {
        toastId: "saveEditedTradeOfferItemGroupError",
      });
      setDisabled(false);
    });
};

// action for get data by id single
export const getTradeItemGroupById = (id) => (dispatch) => {
  requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetSingleData(res.data));
      }
    })
    .catch((err) => {
     
    });
};

// Controlling unit single to empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
