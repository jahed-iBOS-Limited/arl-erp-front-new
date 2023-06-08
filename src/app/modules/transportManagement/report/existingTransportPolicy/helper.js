import Axios from "axios";
import { toast } from "react-toastify";

export const getexistingTranportPolicyLandingData = async (
  accId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/Shipment/GetExistingTransportPolicy?AccountId=${accId}&BusinessunitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
