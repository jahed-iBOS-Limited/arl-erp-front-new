import * as requestFromServer from "./Api";
import { shipmentSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = shipmentSlice;

export const getSalesOfficeDDLAction = (accId, buId, SalesOrgId) => (
  dispatch
) => {
  return requestFromServer
    .GetSalesOfficeDDLbyId(accId, buId, SalesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSalesOfficeDDL(data));
      }
    });
};

export const getSoldToPPIdAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetSoldToPPId(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSoldToPPDDL(data));
    }
  });
};
export const getBUsalesOrgIncotermDDLAction = (accId, buId, salesOrgId) => (
  dispatch
) => {
  return requestFromServer
    .GetBUsalesOrgIncotermDDL(accId, buId, salesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetBUsalesOrgIncotermDDL(data));
      }
    });
};
export const getPaymentTermsDDLAction = (accId, buId, salesOrgId) => (
  dispatch
) => {
  return requestFromServer.GetPaymentTermsDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPaymentTermsDDL(data));
    }
  });
};
export const GetVehicleDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetVehicleDDLApi(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetVehicleDDL(data));
    }
  });
};
export const GetRouteListDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetRouteListDDLApi(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetRouteListDDL(data));
    }
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
export const GetTransportZoneDDLAction = (RouteId, BuId) => (dispatch) => {
  return requestFromServer.GetTransportZoneDDLApi(RouteId, BuId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetTransportZoneDDL(data));
    }
  });
};
export const GetShipmentTypeDDLAction = () => (dispatch) => {
  return requestFromServer.GetShipmentTypeDDLApi().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetshipmentTypeDDL(data));
    }
  });
};
export const GetPendingDeliveryDDLAction = (routeId, buId, accId) => (
  dispatch
) => {
  return requestFromServer
    .getPendingDeliveryapi(routeId, buId, accId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetPendingDeliveryDDL(data));
      }
    });
};
export const getLoadingPointDDLAction = (accId, buId, pointId) => (
  dispatch
) => {
  return requestFromServer
    .getLoadingPointDDL(accId, buId, pointId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetLoadingPointDDL(data));
      }
    });
};
export const getDeliveryeDatabyId = (id) => (dispatch) => {
  return requestFromServer
    .GetPendingDeliveryInfoByDeliveryIdApi(id)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetDeliverydatabyId(data[0]));
      }
    });
};


export const getVehicleSingleDatabyVehicleIdAction = (
  id,
  accId,
  buId,
  setter
) => (dispatch) => {
  return requestFromServer
    .getVehicleInfoByVehicleIdAPI(id, accId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        setter("driverId", data[0]?.driverId);
        setter("driverName", data[0]?.driverName);
        setter("driverContactNo", data[0]?.driverContact);
        setter("vehicleId", data[0]?.vehicleId);
        dispatch(slice.SetVehicleSingleData(data[0]));
      }
    });
};

export const getDeliveryItemVolumeInfoAction = (id) => (dispatch) => {
  return requestFromServer.getDeliveryItemVolumeInfo(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDeliveryItemVolumeInfo(data));
    }
  });
};
// action for save created data
export const saveShipment = (payload, setDisabled) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
// action for save edited data
export const saveEditedShipment = (payload, setDisabled) => () => {
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
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for get grid data
export const getSalesContactGridData = (
  accId,
  buId,
  ShipmentId,
  reportTypeId,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, ShipmentId, reportTypeId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};

// action for get data by id single
export const getSalesContactById = (accId, buId, id) => (dispatch) => {
  return requestFromServer
    .getDataById(accId, buId, id)
    .then((res) => {
      if (res.status === 200 && res.data) {
        const item = res.data[0];
        const data = {
          ...item,
          shipmentHeader: {
            ...item.shipmentHeader,
            route: {
              value: item.shipmentHeader.routeId,
              label: item.shipmentHeader.routeName,
            },
            transportMode: {
              value: item.shipmentHeader.transportModeId,
              label: item.shipmentHeader.transportModeName,
            },
            shipmentType: {
              value: item.shipmentHeader.shippingTypeId,
              label: item.shipmentHeader.shippingTypeName,
            },
            salesOffice: {
              value: item.shipmentHeader.salesOfficeId,
              label: item.shipmentHeader.salesOfficeName,
            },
            Vehicle: {
              value: item.shipmentHeader.vehicleId,
              label: item.shipmentHeader.vehicleName,
            },
            shipPoint: {
              value: item.shipmentRowList[0].shipPointId,
              label: item.shipmentRowList[0].shipPointName,
            },
            transportZone: {
              value: item.shipmentRowList[0].transportZoneId,
              label: item.shipmentRowList[0].transportZoneName,
            },
            lastDistance: item.shipmentHeader.lastDestinationKM,
            shipmentdate: item.shipmentHeader.shipmentDate,
            estimatedTimeofArrival: item.shipmentHeader.actualDepartureDateTime,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};

// set single store empty
export const setSalesContactSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};


// action for save created data
export const saveShipmentId_action = (payload) => () => {
  return requestFromServer
    .saveShipmentId(payload.data)
    .then((res) => {
      if (res.status === 200) {
      
       // toast.success(res.data?.message || "Submitted successfully");
        payload.gridRefresh();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};


