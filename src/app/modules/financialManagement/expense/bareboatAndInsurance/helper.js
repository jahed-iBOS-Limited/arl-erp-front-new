import axios from "axios";
import { toast } from "react-toastify";

export const dryDockSaveHandler = async (setLoading, payload, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/fino/BareBoatManagement/BareboatAndInsurenceTransaction`,
      payload
    );
    cb && cb();
    toast.success(res?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
