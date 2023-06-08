import Axios from "axios";
import { toast } from "react-toastify";

export const GetSalesOrderReportByItemWise_api = async (
  accId,
  buId,
  reportType,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesOrder/GetSalesOrderReportByItemWise?AccountId=${accId}&BusinessUnitId=${buId}&ReportType=${reportType}&FromDate=${fromDate}&Todate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("No Data Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const GetSalesOrderReportInfoByItemWise_api = async (
  obj,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const { itemId, fromDate, toDate, accountId, businessUnitId } = obj;
    const res = await Axios.get(
      `/oms/SalesOrder/GetSalesOrderReportInfoByItemWise?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&ItemId=${itemId}&FromDate=${fromDate}&Todate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("No Data Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
