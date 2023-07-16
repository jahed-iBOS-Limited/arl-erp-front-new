import axios from "axios";
import { toast } from "react-toastify";

export const rateApprove = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/costmgmt/CostElement/UpdateServiceChargeAndIncomeElementRate`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
