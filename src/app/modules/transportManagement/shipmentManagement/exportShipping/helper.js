import axios from "axios";
import { toast } from "react-toastify";

export const getVehicleWeightInfo = async (
  shipmentCode,
  buId,
  setter,
  loading
) => {
  loading(true);
  try {
    const res = await axios.get(
      `/wms/ShipmentRequest/GetMagnumItemBundelPieces?ShipmentCode=${shipmentCode}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    loading(false);
  } catch (error) {
    setter([]);
    loading(false);
  }
};

export const saveVehiclesWeight = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    await axios.put(`/wms/ShipmentRequest/EditMagnumItemBundelPieces`, data);
    setLoading(false);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getItemListForChallan = async (
  accId,
  buId,
  setter,
  payload,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `oms/ItemListBySalesOffice/GetItemInfoForChallan?AccountId=${accId}&isActive=true&BusinessUnitId=${buId}`,
      payload
    );
    setter(res?.data);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getTransportStatusAndInfo = async (
  partId,
  buId,
  deliveryId,
  setter,
  loading
) => {
  loading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/sprTransportStatusByDeliveryId?intParid=${partId}&intBusinessUnitId=${buId}&PKID=${deliveryId}`
    );
    setter(res?.data);
    loading(false);
  } catch (error) {
    setter([]);
    loading(false);
  }
};

export const UpdateManualChallanInfo = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/wms/Delivery/UpdateManualChallan`, payload);
    toast.success(res?.data?.message);
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const shipmentInfoUpdate = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/Shipment/UpdateShipmentInfo`, payload);
    toast.success(res?.data?.message);
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
