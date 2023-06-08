import axios from "axios";
import { toast } from "react-toastify";

export const deleteInitiativeAction = async (id, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.put(
      `/pms/StrategicParticulars/DeleteStrategicParticulars?strategicParticularsId=${id}`
    );
    toast.success(res?.data?.message || "Successfully deleted");
    setLoading(false);
    cb && cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Delete failed");
  }
};
