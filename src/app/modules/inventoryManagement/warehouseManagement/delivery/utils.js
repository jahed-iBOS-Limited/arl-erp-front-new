import axios from "axios";
import { toast } from "react-toastify";

export const mode = [
  { value: 1, label: "Company" },
  { value: 2, label: "Supplier" },
];
export const carType = [
  { value: 1, label: "Open" },
  { value: 2, label: "Covered" },
];
export const bagType = [
  { value: 1, label: "Sewing" },
  { value: 2, label: "Pasting" },
  { value: 3, label: "MES OPC" },
  { value: 4, label: "MES PCC" },
];
export const deliveryMode = [
  { value: 1, label: "Day" },
  { value: 2, label: "Night" },
];

export const getInvoiceDataForPrint = async ({ accId, buId, deliveryId, setLoading, cb }) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Delivery/DeliveryInvoiceReportWithSerialNumber?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryId=${deliveryId}`
    );
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getDeliveryChallanInfoById = async (id, setter, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(`/wms/ShopBySales/GetDeliveryOpenChallanByDeliveryId?DeliveryId=${id}`);
    setter(res?.data[0]);
    cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const printCount = async (accId, buId, id) => {
  try {
    await axios.put(`/wms/ShopBySales/SetPrintCount?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryId=${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const GetShipmentTypeApi = async (accId, buId, territoryId, setter, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/DeliveryRequisition/GetShipmentType?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );

    const dataModify = res?.data?.map((item) => ({
      value: item?.shipmentTypeId,
      label: item?.shipmentType,
      extraRate: item?.extraRate || 0,
    }));
    setter(dataModify || []);
    cb(dataModify);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetDeliveryApprroximateDateTimeApi = async (
  buId,
  shippointId,
  requestTime,
  requestQty,
  territoryId,
  shipmentTypeId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Delivery/GetDeliveryApprroximateDateTime?BusinessUnitId=${buId}&ShippointId=${shippointId}&RequestTime=${requestTime}&RequestQty=${requestQty}&TerritoryId=${territoryId}&ShipmentTypeId=${shipmentTypeId}`
    );
    cb(res?.data || "");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};
