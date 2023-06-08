import Axios from "axios";
import { toast } from "react-toastify";

export const getBusinessUnitDDL = async (setter, accountId) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const SalaryGenarateLandingAction = async (
  buId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/MonthlySalaryGenerate/GetMonthlySalaryGenarateLandingPagination?BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=1&PageSize=123&viewOrder=desc `
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};
