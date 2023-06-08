import axios from "axios";
import { toast } from "react-toastify";

export const getOrderCompleteInfo = async (accId, buId, orderId, setter) => {
  try {
    let res = await axios.get(
      `/oms/SalesOrder/GetOrderCompleteInfo?AccountId=${accId}&BusinessUnitId=${buId}&OrderId=${orderId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
      //   setter({
      //     ...res?.data,
      //     commentRequired: true,
      //   });
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getChannelBaseCollectionDays = async (buId, channelId, setter) => {
  try {
    let res = await axios.get(
      `/partner/BusinessPartnerSales/GetChannelBaseCollectionDays?BUnitId=${buId}&ChannelId=${channelId}`
    );

    if (res?.status === 200) {
      setter(res?.data[0] || 0);
    }
  } catch (err) {
    setter(0);
  }
};

export const salesOrderComplete = async (
  orderStatus,
  completeNarration,
  orderId,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/oms/SalesOrder/SalesOrderComplete?orderStatus=${orderStatus}&CompleteNarration=${completeNarration}&OrderId=${orderId}`
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "soc" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "soc",
    });
    setIsLoading(false);
  }
};

export const cancelSalesOrder = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.put(`/oms/SalesOrder/CancelSalesOrder`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "cso" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "cso",
    });
    setIsLoading(false);
  }
};
export const saveShippointTransfer = async (obj) => {
  const {
    buid,
    shipmentId,
    shipPointName,
    setLoading,
    salesOrderId,
    cb,
    setIsTransferModel,
    callBackFuncGridData,
  } = obj;
  setLoading(true);
  try {
    let res = await axios.put(
      `/wms/ShipPoint/EditSalesOrderShippoint?businessUnitId=${buid}&ShippointId=${shipmentId}&shipPointName=${shipPointName}&salesOrderId=${salesOrderId}`
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "cso" });
      setLoading(false);
      setIsTransferModel(false);
      callBackFuncGridData();
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "cso",
    });
    setLoading(false);
    setIsTransferModel(false);
  }
};

export const rejectSalesOrder = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.put(`/oms/SalesOrder/RejectSalesOrder`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "cso" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "cso",
    });
    setIsLoading(false);
  }
};

export const logisticByDDL = [
  { value: 1, label: "Company" },
  { value: 2, label: "Customer" },
];
export const isBooleanDDL = [
  { value: false, label: "No" },
  { value: true, label: "Yes" },
];

export const getOrderPendingDetails = async (
  accId,
  buId,
  partnerId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerSales/GetOrderPendingQuantityDetails?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${partnerId}`
    );
    setter(res?.data);
    cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetPendingQuantityDetails = async (
  accId,
  buId,
  partnerId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerSales/GetPendingQuantityDetails?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${partnerId}`
    );
    setter(res?.data);
    cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getUnBilledAmountDetails = async (
  buId,
  partnerId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetSalesOrderNUnbilledAmount?partnerId=${partnerId}&intunitid=${buId}&intpartid=1&strSalesOrderCode=""`
    );
    setter(res?.data);
    cb && cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetTradeOffersApi = async (
  payload,
  orderDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/SalesOrder/GetTradeOffers?OrderDate=${orderDate}`,
      payload
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const updateSalesOrder = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(`/oms/SalesOrder/UpdateSalesOrder`, payload);
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
