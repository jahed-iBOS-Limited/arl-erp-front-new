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
    callBackFuncGridData
  } = obj;
  setLoading(true);
  try {
    let res = await axios.put(
      `/wms/ShipPoint/EditSalesOrderShippoint?businessUnitId=${buid}&ShippointId=${shipmentId}&shipPointName=${shipPointName}&salesOrderId=${salesOrderId}`,
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "cso" });
      setLoading(false);
      setIsTransferModel(false);
      callBackFuncGridData()
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
