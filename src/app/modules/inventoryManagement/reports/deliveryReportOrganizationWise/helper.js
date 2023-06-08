import Axios from "axios";
import { toast } from "react-toastify";

export const DeliveryReportOrganizationWiseLandingAction = async (
  accountId,
  businessUnitId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetDeliveryReportOrganizationWiseReport?accountId=${accountId}&businessUnitId=${businessUnitId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};
