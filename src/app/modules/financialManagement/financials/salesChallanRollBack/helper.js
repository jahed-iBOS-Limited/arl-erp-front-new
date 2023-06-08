import axios from "axios";
import { toast } from "react-toastify";

export const getAndInactiveAPI = async ({
  challan,
  buId,
  partId,
  narration,
  inactiveBy,
  customerId,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/SalesChallanRollBack?Challan=${challan}&unitid=${buId}&intpartid=${partId}&strNarration=${narration}&intInactiveBy=${inactiveBy}&intCustomerid=${customerId}`
    );
    setter(res?.data);
    setLoading(false);
    if (partId === 3) {
      toast.success(res?.data?.message);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
