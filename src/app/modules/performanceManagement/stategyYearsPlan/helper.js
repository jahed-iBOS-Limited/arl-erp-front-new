import { toast } from "react-toastify";
import Axios from "axios";

export const getSBUListDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};


export const getYearDDLAction = async (accId, buId,sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/pms/StrategicParticulars/GetYearsToViewFiveYearsPlan?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getFiveYearsPlanLanding = async (
  accId,
  buId,
  sbuId,
  setter,
  setLoading,
  yearId
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/pms/StrategicParticulars/GetFiveYearsPlanLanding?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&yearId=${yearId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
