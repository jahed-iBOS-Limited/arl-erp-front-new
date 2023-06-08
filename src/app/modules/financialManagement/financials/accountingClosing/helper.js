import Axios from "axios";
import { toast } from "react-toastify";

export const createAccountingClosing = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/domain/BusinessUnitClosing/CreateBusinessUnitClosing`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully", {
        toastId: "createAccountingClosing",
      });
      setDisabled(false);
      cb();
    }
  } catch (error) {
    
    setDisabled(false);
  }
};
