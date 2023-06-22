import axios from "axios";
import { toast } from "react-toastify";

export const rateEnrollmentUpdate = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/tms/VehicleExpenseRegister/UpdateMOPCosting`,
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message);
      setLoading(false);
      cb && cb();
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
