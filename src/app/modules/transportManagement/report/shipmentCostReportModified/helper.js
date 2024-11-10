import Axios from "axios";
import { toast } from "react-toastify";

export const getSalesOrderReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  isBillSubmited,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/TMSReport/GetShipmentExpenseDetailsModified?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&isBillSubmited=${isBillSubmited}`
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
    setter([]);
    setLoading(false);
  }
};
