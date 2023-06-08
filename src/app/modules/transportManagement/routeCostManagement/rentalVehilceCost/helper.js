import Axios from "axios";
import { toast } from "react-toastify";

export const GetRentalVehicleCostLandingPasignation_api = async (
  accId,
  buId,
  formDate,
  toDate,
  status,
  setter,
  setFieldValue,
  setLoading,
  search,
  billSubmited,
  supplierId,
  shipmentId,
  reportTypeOne,
  userId
) => {
  setLoading && setLoading(true);
  try {
    const searchPath = search ? `search=${search}&` : "";
    const res = await Axios.get(
      `/tms/RentalVehicleCost/GetRentalVehicleCostLandingPasignation?${searchPath}accountid=${accId}&businessunitid=${buId}&fromdate=${formDate}&todate=${toDate}&closeStatus=${status}&viewOrder=desc&PageNo=1&PageSize=1000&IsBillSubmited=${billSubmited}&vehicleSupplierId=${supplierId}&shipPointId=${shipmentId}&reportType=${reportTypeOne}&userId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading && setLoading(false);
      if (res?.data?.data?.length > 0) {
        const copyRowDto = res?.data?.data?.map((itm) => ({
          ...itm,
          additionalCost: itm?.additionalCost || 0,
          additionalCostReason: itm?.additionalCostReason || "",
          deductionCost: itm?.deductionCost || 0,
          deductionCostReason: itm?.deductionCostReason || "",
          itemCheck: false,
        }));
        setter && setter(copyRowDto);
        setFieldValue && setFieldValue("itemLists", copyRowDto);
      } else {
        toast.warning("Data not found");
        setter && setter([]);
        setFieldValue && setFieldValue("itemLists", []);
      }
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter && setter([]);
    setFieldValue && setFieldValue("itemLists", []);
    toast.error(error?.response?.data?.message);
  }
};

export const EditShipmentStandardCost_api = async (
  payload,
  cb,
  setDisabled,
  setBillSubmitBtn
) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      "/tms/RentalVehicleCost/EditShipmentStandardCost",
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
      setBillSubmitBtn && setBillSubmitBtn(true);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};
export const EditRentalVehicleBillSubmit_api = async (
  payload,
  cb,
  setDisabled,
  setBillSubmitBtn
) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      "/tms/RentalVehicleCost/EditRentalVehicleBillSubmit",
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
      setBillSubmitBtn && setBillSubmitBtn(true);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};

export const getDistanceKm = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/tms/PartnerShipping/GetShipToPartnerDistanceByShipmentId?shipmentId=${id}`
    );

    if (res.status === 200) {
      const data = res?.data?.result?.map((item) => ({
        ...item,
        oldValue: item?.numDistanceKM,
      }));
      setter(data);
    }
  } catch (error) {}
};

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=0`
    );

    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

// export const getChalanInfo = async (shipmentId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/tms/Shipment/GetChallanInfoByShipmentId?shipmentId=${shipmentId}`
//     );

//     if (res.status === 200) {
//       setter(res?.data);
//     }
//   } catch (error) {}
// };

export const getShippingInfo = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Shipment/GetPartnerShippingInformation?ShipmentId=${id}`
    );

    if (res.status === 200) {
      const data = res?.data?.map((item) => ({
        ...item,
        oldValue: item?.rentAmount,
      }));
      setter(data);
    }
  } catch (error) {}
};

export const updateDistanceKM = async (
  shipmentId,
  shipPointId,
  shiptoPartnerId,
  buId,
  distanceKM,
  cb
) => {
  try {
    const res = await Axios.put(
      `/tms/Vehicle/EditVehiclePartnerDistenceKM?ShipmentId=${shipmentId}&ShipPointId=${shipPointId}&ShiptoPartnerId=${shiptoPartnerId}&BusinessUnitId=${buId}&DistanceKM=${distanceKM}`
    );

    if (res.status === 200) {
      // setter(res?.data);
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
  }
};

export const updateRentVehicle = async (
  shipmentId,
  shipPointId,
  shiptoPartnerId,
  buId,
  distanceKM,
  cb
) => {
  try {
    const res = await Axios.put(
      `/tms/Vehicle/EditVehiclePartnerRentAmount?ShipmentId=${shipmentId}&ShipPointId=${shipPointId}&ShiptoPartnerId=${shiptoPartnerId}&BusinessUnitId=${buId}&RentAmount=${distanceKM}`
    );

    if (res.status === 200) {
      // setter(res?.data);
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
  }
};
export const GetTripInfoByTripId = async (
  accId,
  buId,
  tripId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetTripInfoByTripId?AccountId=${accId}&BusinessUnitId=${buId}&TripId=${tripId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const editTripInformation = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put("/wms/Delivery/EditTripInfoByTrip", payload);
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const cancelRentalVehicleCost = async (tripId, reason, userId) => {
  try {
    const res = await Axios.post(
      `/tms/RentalVehicleCost/CancelShipmentStandardCost?TripId=${tripId}&Reason=${reason}&UserId=${userId}`
    );
    toast.success(res?.data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getZoneRateInfo = async (
  buId,
  deliveryCode,
  soldToPartnerId,
  zoneId,
  partId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/GetTransportRateNChallanInfo?strDeliveryCode=${deliveryCode}&intBusinesUnitId=${buId}&intSoldtoPartnerId=${soldToPartnerId}&intPartid=${partId}&intUpdateTransporZoneId=${zoneId}`
    );
    setter(res?.data[0]);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const UpdateZone = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/oms/SalesInformation/TransportRateCorrectioninJV`,
      payload
    );
    toast.success(res?.data?.message || "Updated Successfully!");
    cb && cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
