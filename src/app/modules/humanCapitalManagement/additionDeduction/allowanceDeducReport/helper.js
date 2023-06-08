import Axios from "axios";

export const allowanceDeducReportAction = async (setLoading, setter, buId) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/hcm/HCMReport/GetAllowanceAndDeductionReport?BusinessUnitId=${buId}&IsForDownload=false`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
