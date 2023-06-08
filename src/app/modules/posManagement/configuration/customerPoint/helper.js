import Axios from "axios";
import { toast } from "react-toastify";

export const CreateCustomerPoint = async (payload, setLoading) => {
  setLoading(true);
  try {
    setLoading(false);
    const res = await Axios.post(`/oms/CustomerPoint/CustomerPoint`, payload);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Save Successfully");
    }
  } catch (error) {
    setLoading(false);

    toast.error(error?.response?.data?.message || "error happened");
  }
};

export const getCustomerInitPointAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerPoint/GetCustomerById?accountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data[0] || {});
    }
  } catch (error) {}
};
