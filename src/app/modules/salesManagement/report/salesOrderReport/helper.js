import Axios from "axios";
import { toast } from "react-toastify";

export const getSalesOrderReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  shipPointId,
  channelId,
  viewType,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetOrderVsDeliverySummaryReport?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&shipPointId=${shipPointId}&ViewType=${viewType}&DistributionChannelId=${channelId ||
        0}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("No Data Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getSummaryReportData = async (salesOrderId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetDeliveryDetailReportBySalesOrderId?SalesOrderId=${salesOrderId}`
    );
    setter(res.data);
  } catch (error) {
    setter("");
  }
};
