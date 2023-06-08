import Axios from "axios";
import { toast } from "react-toastify";

export const getCostSheetRevisedLanding = async (
  unitId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/CostSheet/GetCostSheetRevised?Unitid=${unitId}&FromDate=${fromDate}&Todate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Error occured");
    setter([]);
  }
};
