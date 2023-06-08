import axios from "axios";
import { toast } from "react-toastify";

export const inActiveKpiAction = async (id) => {
  try {
    let res = await axios.put(`/pms/Kpi2/KpiInactiveById?kpiId=${id}`);
    toast.success(res?.data?.message || "Submitted successfully");
    window.location.reload();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed, please try again");
  }
};
