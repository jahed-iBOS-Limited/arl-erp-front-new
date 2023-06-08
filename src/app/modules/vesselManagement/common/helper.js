import axios from "axios";
import { toast } from "react-toastify";

export const getGodownDDL = async (buId, partnerId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetShipToPartnerG2GDDL?BusinessUnitId=${buId}&BusinessPartnerId=${partnerId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const radioStyle = { height: "25px", width: "25px" };

export const getTotal = (array, key, filterBy) => {
  const newArray = filterBy
    ? array?.filter((element) => element[filterBy])
    : array;
  const total = newArray?.reduce((a, b) => (a += +b?.[key]), 0);
  return total;
};
