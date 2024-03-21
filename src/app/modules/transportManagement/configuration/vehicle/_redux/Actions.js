import * as requestFromServer from "./Api";
import { vehicleUnitSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = vehicleUnitSlice;

//getVehicleTypeDDLAction
export const getVehicleTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getVehicleTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetVehicleTypeDDL(data));
    }
  });
};
//getVehicleCapacityDDLAction
export const getVehicleCapacityDDLAction = () => (dispatch) => {
  return requestFromServer.getVehicleCapacityDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetVehicleCapacityDDL(data));
    }
  });
};
//getVehicleFuelTypeDDLAction
export const getVehicleFuelTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getVehicleFuelTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetFuelTypeDDL(data));
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
export const saveVehicle = (payload, cb, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveVehicle",
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
export const saveEditedVehicleUnit = (payload, setDisabled) => () => {
  //
  setDisabled(true);
  //
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveEditedVehicleUnit",
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
export const getVehicleGridData = (
  accId,
  buId,
  pageNo,
  pageSize,
  setLoading,
  shipPointId,
  ownerTypeId,
  search
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      accId,
      pageNo,
      pageSize,
      buId,
      search,
      shipPointId,
      ownerTypeId
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
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
          capacityInBag:
            item?.capacityInBag == null
              ? ""
              : parseFloat(item?.capacityInBag) ?? "",
          ownerType: {
            value: item?.ownerTypeId,
            label: item?.ownerType,
          },
          vehicleType: {
            value: item?.vehicleTypeId,
            label: item?.vehicleTypeName,
          },
          employeeName: {
            value: item?.driverId,
            label: item?.driverName,
          },
          transportmode: {
            value: item?.transportMoodId,
            label: item?.transportMoodName,
          },
          vehicleUsePurpose: {
            value: item?.vehicleUsePurposeTypeId,
            label: item?.vehicleUsePurposeTypeName,
          },
          fuelType: {
            value: item?.fuelTypeId,
            label: item?.fuelTypeName,
          },
          vehicleCapacity: {
            value: item?.vehicleCapacityId,
            label: item?.vehicleCapacityName,
          },
          contact: item?.driverContactNo,
          shipPoint: {
            value: item?.shippointId,
            label: item?.shippointName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {});
};
// set single store empty
export const setVehicleUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
