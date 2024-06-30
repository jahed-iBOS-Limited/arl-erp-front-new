import * as requestFromServer from "./Api";
import { shipmentSlice } from "./Slice";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import Axios from "axios";
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
export const getIsSubsidyRunningAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getIsSubsidyRunning_api(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setIsSubsidyRunning(data));
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

export const GetVehicleDDLAction = (accId, buId, setvehicleDDLLoding) => (
  dispatch
) => {
  setvehicleDDLLoding && setvehicleDDLLoding(true);
  return requestFromServer
    .GetVehicleDDLApi(accId, buId)
    .then((res) => {
      setvehicleDDLLoding && setvehicleDDLLoding(false);
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetVehicleDDL(data));
      }
    })
    .catch((err) => {
      setvehicleDDLLoding && setvehicleDDLLoding(false);
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

export const GetShipmentCostlaborRateStatusApi = async (
  shipmentId,
  zoneId,
  buId,
  deliveryId,
  vehicleId,
  setCostlaborRateStatus,
  setLoading
) => {
  try {
    const res = await Axios.get(
      `/tms/ShipmentCostRate/GetShipmentCostlaborRateStatus?shippointId=${shipmentId}&zoneId=${zoneId}&BusinessUnitId=${buId}&deliveryId=${deliveryId}&VehicleId=${vehicleId}`
    );
    setCostlaborRateStatus(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setCostlaborRateStatus(false);
  }
};

export const getDeliveryeDatabyId = (
  deliveryId,
  values,
  buId,
  setCostlaborRateStatus,
  setLoading
) => (dispatch) => {
  setLoading && setLoading(true);
  dispatch(slice.SetDeliverydatabyId([]));
  return requestFromServer
    .GetPendingDeliveryInfoByDeliveryIdApi(deliveryId)
    .then((res) => {
      dispatch(slice.SetDeliverydatabyId(res?.data?.[0]));
      // if Labor Provided false , than api call
      GetShipmentCostlaborRateStatusApi(
        values?.shipPoint?.value,
        res?.data?.[0]?.routeInfo?.[0]?.zoneId,
        buId,
        deliveryId,
        values?.vehicleId,
        setCostlaborRateStatus,
        setLoading
      );
    })
    .catch((err) => {
      setLoading && setLoading(false);
      dispatch(slice.SetDeliverydatabyId([]));
      toast.error(err?.response?.data?.message);
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
        if (setter) {
          setter("driverId", data?.[0]?.driverId);
          setter("driverName", data?.[0]?.driverName);
          setter("driverContactNo", data?.[0]?.driverContact);
          setter("vehicleId", data?.[0]?.vehicleId);
        }
        dispatch(slice.SetVehicleSingleData(data?.[0]));
      }
    });
};

export const getDeliveryItemVolumeInfoAction = (id, setDisabled) => (
  dispatch
) => {
  setDisabled(true);
  return requestFromServer
    .getDeliveryItemVolumeInfo(id)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetDeliveryItemVolumeInfo(data));
      }
      setDisabled(false);
    })
    .catch((err) => {
      setDisabled(false);
      dispatch(slice.SetDeliveryItemVolumeInfo(""));
    });
};
export const GetItemWeightInfo_action = (ShipmentCode, buId, setLoading) => (
  dispatch
) => {
  setLoading(true);
  return requestFromServer
    .GetItemWeightInfo(ShipmentCode, buId)
    .then((res) => {
      const { status, data } = res;
      setLoading(false);
      if (status === 200 && data) {
        dispatch(slice.setItemWeightInfo(data?.[0]));
      }
    })
    .catch((err) => {
      dispatch(slice.setItemWeightInfo(""));
      setLoading(false);
    });
};

// action for save created data
export const saveShipment = (payload) => () => {
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
      console.log(err);
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
  fromDate,
  toDate,
  search,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      accId,
      buId,
      ShipmentId,
      reportTypeId,
      fromDate,
      toDate,
      search,
      pageNo,
      pageSize
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};

// action for get grid data
export const getSalesContactIncompleteGridData = (
  accId,
  buId,
  ShipmentId,
  tillDate,
  search,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getIncompleteGridData(
      accId,
      buId,
      ShipmentId,
      tillDate,
      search,
      pageNo,
      pageSize
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetIncompleteGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};

// action for get data by id single
export const getSalesContactById = (accId, buId, id, setDisabled) => (
  dispatch
) => {
  setDisabled && setDisabled(true);
  return requestFromServer
    .getDataById(accId, buId, id)
    .then((res) => {
      setDisabled && setDisabled(false);
      if (res.status === 200 && res.data) {
        const item = res.data[0];
        const data = {
          ...item,
          shipmentHeader: {
            ...item.shipmentHeader,
            route: {
              value: item?.shipmentHeader?.routeId,
              label: item?.shipmentHeader?.routeName,
            },
            transportMode: {
              value: item?.shipmentHeader?.transportModeId,
              label: item?.shipmentHeader?.transportModeName,
            },
            shipmentType: {
              value: item?.shipmentHeader?.shippingTypeId,
              label: item?.shipmentHeader?.shippingTypeName,
            },
            salesOffice: {
              value: item.shipmentHeader?.salesOfficeId,
              label: item.shipmentHeader?.salesOfficeName,
            },
            Vehicle: {
              value: item?.shipmentHeader?.vehicleId,
              label: item?.shipmentHeader?.vehicleName,
              isRental: item?.shipmentHeader?.isRental || false,
            },
            shipPoint: {
              value: item?.shipmentRowList[0]?.shipPointId,
              label: item?.shipmentRowList[0]?.shipPointName,
            },
            transportZone: {
              value: item?.shipmentRowList[0]?.transportZoneId,
              label: item?.shipmentRowList[0]?.transportZoneName,
            },
            supplierName: item?.shipmentHeader?.supplierId
              ? {
                  value: item?.shipmentHeader?.supplierId,
                  label: item?.shipmentHeader?.supplierName,
                }
              : "",
            laborSupplierName: item?.shipmentHeader?.laborSupplierId
              ? {
                  value: item?.shipmentHeader?.laborSupplierId,
                  label: item?.shipmentHeader?.laborSupplierName,
                }
              : "",
            veichleEntry: item?.shipmentHeader?.vehicleEntryId
              ? {
                  value: item?.shipmentHeader?.vehicleEntryId,
                  label: item?.shipmentHeader?.vehicleEntryCode,
                }
              : "",
            strCardNo: item?.shipmentHeader?.cardNumber,
            lastDistance: item?.shipmentHeader?.lastDestinationKM,
            shipmentdate: item?.shipmentHeader?.shipmentDate,
            estimatedTimeofArrival: _dateFormatter(
              item?.shipmentHeader?.actualDepartureDateTime
            ),
            planedLoadingTime: _dateFormatter(
              item?.shipmentHeader?.planedLoadingTime
            ),
            isLaborImpart: item?.shipmentHeader?.isLaborImpart
              ? { value: true, label: "Yes" }
              : { value: false, label: "No" },
            pump: item?.shipmentHeader?.pumpModelId
              ? {
                  value: item?.shipmentHeader?.pumpModelId,
                  label: item?.shipmentHeader?.pumpModelName,
                  pumpGroupHeadEnroll:
                    item?.shipmentHeader?.pumpGroupHeadEnroll,
                }
              : "",
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false);
      console.log(err);
    });
};

// set single store empty
export const setSalesContactSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
export const setGridEmptyAction = () => async (dispatch) => {
  return dispatch(slice.setGridEmpty());
};

//GetShipPointDDLAction action
export const GetShipPointDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetShipPointDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetShipPointDDL(data));
    }
  });
};
//getStockStatusOnShipment
export const getStockStatusOnShipmentAction = (
  deliveryId,
  buId,
  setLoadingTwo
) => (dispatch) => {
  setLoadingTwo && setLoadingTwo(true);
  dispatch(slice.SetStockStatusOnShipment(false));
  return requestFromServer
    .getStockStatusOnShipment(deliveryId, buId)
    .then((res) => {
      const { status, data } = res;
      setLoadingTwo && setLoadingTwo(false);
      if (status === 200 && data) {
        dispatch(slice.SetStockStatusOnShipment(data));
      }
    })
    .catch((err) => {
      setLoadingTwo && setLoadingTwo(false);
      toast.error(err?.response?.data?.message);
      dispatch(slice.SetStockStatusOnShipment(false));
    });
};
export const getVehicleNo_action = (deliveryId, buId) => (dispatch) => {
  return requestFromServer
    .getVehicleNo(deliveryId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setVehicleNo(data));
      }
    })
    .catch((err) => {
      // toast.error(err?.response?.data?.message);
      dispatch(slice.setVehicleNo(""));
    });
};

// action for save created data
export const saveShipmentId_action = (
  payload,
  userId,
  viewBtnClickHandler,
  values,
  pageNo,
  pageSize
) => () => {
  return requestFromServer
    .saveShipmentId(payload, userId)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        viewBtnClickHandler(pageNo, pageSize, values);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
export const createShipmentCompleteAction = (
  accId,
  buid,
  shipmentId,
  actionId,
  viewBtnClickHandler,
  pageNo,
  pageSize,
  values,
  setLoading
) => () => {
  setLoading(true);
  return requestFromServer
    .createShipmentComplete(accId, buid, shipmentId, actionId)
    .then((res) => {
      setLoading(false);
      toast.success(res.data?.message || "Submitted successfully");
      viewBtnClickHandler && viewBtnClickHandler(pageNo, pageSize, values);
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      viewBtnClickHandler && viewBtnClickHandler(pageNo, pageSize, values);
    });
};

export const SaveVehicleWeight = (
  ShipmentId,
  loadedWeight,
  UnloadedWeight,
  TotalBundle,
  TotalPieces
  // cb
) => () => {
  return requestFromServer
    .saveVehicleWeight(
      ShipmentId,
      loadedWeight,
      UnloadedWeight,
      TotalBundle,
      TotalPieces
    )
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
