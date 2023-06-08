import axios from "axios";
import { toast } from "react-toastify";

export const bulkKPIEntry = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/SalesForceKPI/UpdateSalesForceKPIAchievement`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
