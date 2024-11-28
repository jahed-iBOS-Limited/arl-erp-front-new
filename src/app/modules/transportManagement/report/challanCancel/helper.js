import Axios from "axios";
import { toast } from "react-toastify";

export const getDistributionChannelDDL_api = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getChallanInfo = async (
  accId,
  buId,
  customerId,
  challan,
  naration,
  partId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/SalesChallanRollBack?Challan=${challan}&unitid=${buId}&intpartid=${partId}&strNarration=${naration}&intInactiveBy=${accId}&intCustomerid=${customerId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
