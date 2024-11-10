import * as requestFromServer from "./Api";
import { billOfMaterialSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = billOfMaterialSlice;

// save cost element data
export const saveCostElement = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// get item ddl from server
export const getItemDDLAction = (accId, buId, plantId) => (dispatch) => {
  return requestFromServer.getItemDDL(accId, buId, plantId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetItemDDL(data));
    }
  });
};

// get getuomDDL from server
export const getuomDDLAction = (accId, buId, plantId, itemId) => (dispatch) => {
  return requestFromServer
    .getuomDDL(accId, buId, plantId, itemId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        return dispatch(slice.SetuomDDL(data));
      }
    });
};

// get copy from ddl from server
export const getcopyFromDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getcopyFromDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetcopyFromDDL(data));
    }
  });
};

// bill of material action for get data of table
export const getBOMGridData = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {});
};

// bill of material action for get view modal data
export const getViewModalData = (accId, buId, bomId) => (dispatch) => {
  return requestFromServer
    .getViewModal(accId, buId, bomId)
    .then((res) => {
      let {
        plantName,
        itemName,
        itemId,
        uoMName,
        outUnitOfMeasureId,
        billOfMaterialName,
        lotSize,
        netWeightKg,
        remarks,
        plantId,
      } = res.data[0].objHeader;
      let obj = {
        plantName: { value: plantId, label: plantName },
        itemName: { value: itemId, label: itemName },
        itemTwo: "",
        uoM: { value: outUnitOfMeasureId, label: uoMName },
        uoMTwo: "",
        quantity: "",
        lotSize,
        netWeight: netWeightKg,
        netWeightTwo: "",
        bomName: billOfMaterialName,
        comments: remarks,
        copyfrom: "",
      };

      return dispatch(slice.SetSingleData(obj));
    })
    .catch((err) => {});
};

// net weight
export const getnetWeightData = (accId, buId, plantId, itemId) => (
  dispatch
) => {
  return requestFromServer
    .getnetWeight(accId, buId, plantId, itemId)
    .then((res) => {
      return dispatch(slice.SetnetWeight(res.data));
    })
    .catch((err) => {});
};

// net weight
export const getbomListDataAction = (bomId) => (dispatch) => {
  return requestFromServer
    .getBomListData(bomId)
    .then((res) => {
      return dispatch(slice.SetbomListData(res.data));
    })
    .catch((err) => {});
};

// Save bom data into DB
export const saveBoMData = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// Save edited bom data into DB
export const saveEditedBoMData = (payload) => () => {
  return requestFromServer
    .saveEditedData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// Controlling unit single to empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
