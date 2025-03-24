import axios from "axios";
import { toast } from "react-toastify";
export const getPaySlip_api = async (empId, date, setter, setLoading) => {
  setLoading(true);
  try {
    const url = `/hcm/PdfReport/PaySlipAPI?EmployeeId=${empId}&Date=${date}`;

    const res = await axios.get(url);
    if (res?.data?.length < 1) toast.warn("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter("");
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
