import Axios from "axios";
import { toast } from "react-toastify";

export const SaveBulkSalesTargetSetup = async (data) => {
  // setDisabled && setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/SalesTarget/CreateBulkSalesTarget`,
      data
    );
    if (res.status === 200 && res?.data) {
      // setDisabled && setDisabled(false);
      toast.success("created successfully");
    }
  } catch (error) {
    // setDisabled && setDisabled(false);
    toast.warn(error?.response?.data?.message);
  }
};
