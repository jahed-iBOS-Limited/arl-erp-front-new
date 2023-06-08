import axios from "axios";
import { toast } from "react-toastify";

export const deleteLighterDestination = async (id,userId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/DeleteLighterDistination?DestinationId=${id}&UserEnroll=${userId}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
