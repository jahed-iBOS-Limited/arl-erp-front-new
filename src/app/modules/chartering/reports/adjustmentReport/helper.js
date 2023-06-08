import axios from "axios";
import { toast } from "react-toastify";

//Landing
export const OutstandingAdjustReport = async (
  payload,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/hcm/OutstandingAdjust/OutstandingAdjustLanding?partName=OutstandingAdjustReport`,
      payload
    );
    setter(res?.data);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
