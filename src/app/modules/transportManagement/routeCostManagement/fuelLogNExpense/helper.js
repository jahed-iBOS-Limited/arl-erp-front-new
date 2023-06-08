import axios from "axios";
import { toast } from "react-toastify";

export const getFuelLogNExpense = async (
  reportType,
  yearId,
  monthId,
  applicantEnroll,
  reportViewBy,
  setter,
  setLoading
) => {
  setLoading(true);
  const enroll = applicantEnroll ? `&ApplicantEnroll=${applicantEnroll}` : "";
  try {
    const res = await axios.get(
      `/tms/InternalTransport/GetVehicleFuelCashVsExpenseEntry?Reportype=${reportType}&YearId=${yearId}&Monthid=${monthId}${enroll}&ReportviewBy=${reportViewBy}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};
