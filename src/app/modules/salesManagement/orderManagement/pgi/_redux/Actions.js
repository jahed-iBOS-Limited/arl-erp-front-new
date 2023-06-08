import * as requestFromServer from "./Api";
import { PGISlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = PGISlice;


// action for save created data
export const saveShipmentId_action = (payload, values) => () => {
  return requestFromServer
    .saveShipmentId(payload?.data,payload?.actionId)
    .then((res) => {
      if (res.status === 200) {
       toast.success(res.data?.message || "Submitted successfully");
        payload.gridRefresh(values);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
    });
};

// action for save edited data
export const saveEditedPGI = (payload) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getPGIGridData = (accId, buId, shipPointId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId, shipPointId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// action for checking that PGI is exist
export const getIsPGICheck_Action = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getIsPGICheck(accId, buId)
    .then((res) => {
      return dispatch(slice.SetIsPGICheck(res.data));
    })
    .catch((err) => {
     
    });
};

// action for get data by id single
export const getPGIById = (id) => (dispatch) => {
  return requestFromServer
    .saveShipmentId(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item.responsiblePerson,
            label: item.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setPGISingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
