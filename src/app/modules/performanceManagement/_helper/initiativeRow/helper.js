import axios from "axios";
import { toast } from "react-toastify";

export const saveStrategicInitiativeRowAction = async (payload, setLoading) => {
  try {
    setLoading(true);
    let res = await axios.put(
      `/pms/StrategicParticulars/UpdateStrategicInitiative`,
      payload
    );
    setLoading(false);
    toast.success(res?.data?.message || "Updated successfully");
  } catch (err) {
    setLoading(false);
    toast.error(
      err?.response?.data?.message || "Something went wrong, Try again"
    );
  }
};
