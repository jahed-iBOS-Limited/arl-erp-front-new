import * as requestFromServer from "./Api";
import { coreValuesTwoSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = coreValuesTwoSlice;

// action for save created data
export const saveCoreValues = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setRowDto([]);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedCoreValues = (payload, cb) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "editedcorevalues",
        });
        cb();
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message, {
        toastId: "editedcorevalues",
      });
      cb();
    });
};
// action for get grid data
export const getCoreValuesGridData = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// action for get data by id single
export const getCoreValuesById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && res.data) {
        let data = {
          ...res?.data,
          objHeader: {
            ...res?.data?.objHeader,
            demonstratedBehaviour: "",
            isPositive: true,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setCoreValuesEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
