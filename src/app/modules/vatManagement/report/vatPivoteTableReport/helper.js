import Axios from "axios";
import { toast } from "react-toastify";

export const getVatPivoteTableReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  type,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/vat/DigitalReport/GetSalesPurchasePivot?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&Type=${type}`
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
  }
};
