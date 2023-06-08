import Axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  shipmentId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/ShipmentCostRate/GetSlabShipmentCostRate?AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shipmentId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
