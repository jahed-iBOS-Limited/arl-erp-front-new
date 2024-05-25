import Axios from "axios";
import { toast } from "react-toastify";

export const GetPartnerAllotmentLanding = async (
  buId,
  reportType,
  fromDate,
  toDate,
  certainDate,
  setLoading,
  setter,
  values
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/SalesInformation/GetOperationalSetUpBaseAchievement?PartId=${reportType}&Fromdate=${fromDate}&Todate=${toDate}&Certaindate=${certainDate}&Unitid=${buId}&ChannelId=${values?.channel?.value || 0}&RegionId=${values?.region?.value || 0}&AreaId=${values?.area?.value || 0}&TerritoryId=${values?.territory?.value || 0}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};
