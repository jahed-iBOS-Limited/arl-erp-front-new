import axios from "axios";
import { toast } from "react-toastify";

export const getSalesOrderHistoryLanding = async (
  accId,
  buId,
  chId,
  customerId,
  date,
  salesOrderId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/oms/SalesOrder/GetSalesOrderHistory?AccountId=${accId}&BusinessUnitId=${buId}&ReportDate=${date}&DistributionChannel=${chId}&CustomerId=${customerId}&OrderId=${salesOrderId}`
    );
    if (res?.status === 200) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getSalesOrderWithPendingLanding = async (
 {
  partId,
  buId,
  orderCode,
  shippointId,
  userId,
  reason,
  customerId,
  setLoading,
  setter
 }
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/oms/SalesInformation/GetSalesOrderPendingInfoDet?intPartid=${partId}&intBusinessUnitId=${buId}&strSalesOrderCode=${orderCode || ""}&intShippointId=${shippointId}&intUpdateBy=${userId}&strResson=${reason || "N/A"}&intcustomerid=${customerId}`
    );
    if (res?.status === 200) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getSalesOrderDDL = async (
  accId,
  buId,
  customerId,
  date,
  setter
) => {
  try {
    let res = await axios.get(
      `/oms/SalesOrder/GetPartnerandDateWiseOrderDDL?AccountId=${accId}&BusinessUnitId=${buId}&CustomerId=${customerId}&ReportDate=${date}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getCustomerDDL = async (accId, buId, chId, setter) => {
  try {
    let res = await axios.get(
      `/oms/DistributionChannel/GetDistributionByChanneIdlDDL?accountId=${accId}&businessUnitId=${buId}&distributionChannelId=${chId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getChallanHistory = async (
  partId,
  isSlabBase,
  code,
  partnerId,
  buId,
  pkId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetOrderChallanShipmentStatus?PartId=${partId}&slabbase=${isSlabBase}&Code=${code}&SoldtoPartnerid=${partnerId}&UnitID=${buId}&PrimaryKeyId=${pkId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
