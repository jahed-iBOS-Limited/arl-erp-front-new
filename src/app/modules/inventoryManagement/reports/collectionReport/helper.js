import Axios from "axios";
import { toast } from "react-toastify";


export const getDeliveryCollectionDueReport = async (
  accId,
  buId,
  typeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetDeliveryCollectionDueReport?AccountId=${accId}&BusinessUnitId=${buId}&Type=${typeId}`
    );
    setter(res?.data);
      setLoading(false);
    }
  catch (error) {
    toast.error(error?.response?.data?.message || "Error occured")
    setLoading(false);
  }
};