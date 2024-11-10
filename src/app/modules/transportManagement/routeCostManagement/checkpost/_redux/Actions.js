import * as requestFromServer from "./Api";
import { vehicleUnitSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = vehicleUnitSlice;

export const getVehicleTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getVehicleTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
       dispatch(slice.SetVehicleTypeDDL(data));
    }
  });
};

// action for getting Employee list 
export const getEmployeeListDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmployeeListDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
       dispatch(slice.SetEmployeeListDDL(data));
    }
  });
};

// action for save created data
export const saveVehicle = (payload) => () => {
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
// action for save edited data
export const saveEditedVehicleUnit = (payload) => () => {
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
export const getVehicleGridData = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};
export const GetTransportModeDDLAction = () => (dispatch) => {
  return requestFromServer.GetTransportModeDDLApi().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetTransportModeDDL(data));
    }
  });
};
export const GetVehicleUsePurposeDDLAction = () => (dispatch) => {
  return requestFromServer.getVehicleUsePurposeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetVehicleUsePurposeDDL(data));
    }
  });
};
// action for get data by id single
export const getSingleById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          ownerType: {
            value: item?.ownerTypeId,
            label: item?.ownerType,
          },
          vehicleType: {
            value: item?.vehicleTypeId,
            label: item?.vehicleTypeName
          },
          employeeName: {
            value: item?.driverId,
            label: item?.driverName
          },
          transportmode: {
            value: item?.transportMoodId,
            label: item?.transportMoodName
          },
          vehicleUsePurpose: {
            value: item?.vehicleUsePurposeTypeId,
            label: item?.vehicleUsePurposeTypeName
          },
          contact: item?.driverContactNo
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setVehicleUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
