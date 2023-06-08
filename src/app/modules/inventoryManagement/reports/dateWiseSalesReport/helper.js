import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export const GetDateWiseSalesReport = async (
  accId,
  buId,
  shipPointId,
  fromDate,
  toDate,
  fromTime,
  toTime,
  setter,
  orgId
) => {
  const fromDateTime = moment(`${fromDate} ${"00:00"}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const toDateTime = moment(`${toDate} ${"00:00"}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetDatewiseSalesReport?AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shipPointId}&FromDate=${fromDateTime}&ToDate=${toDateTime}&SalesOrganizationId=${orgId}`
    );
    setter(res?.data);
  } catch (e) {
    toast.error(e.message);
  }
};
export const GetSalesOrganizationDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
