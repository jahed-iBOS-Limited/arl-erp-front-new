import Axios from "axios";
import { toast } from "react-toastify";

export const GetPartnerAllotmentLanding = async (
  buId,
  reportType,
  fromDate,
  toDate,
  certainDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/SalesInformation/GetOperationalSetUpBaseAchievement?PartId=${reportType}&Fromdate=${fromDate}&Todate=${toDate}&Certaindate=${certainDate}&Unitid=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};
