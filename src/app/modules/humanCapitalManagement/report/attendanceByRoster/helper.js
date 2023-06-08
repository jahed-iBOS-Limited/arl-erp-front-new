import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";

export const roasterReportDetailsLanding_api = async (
  monthId,
  yearId,
  buId,
  department,
  setLoading,
  setter,
  workplaceGroupId
) => {
  try {
    let str = "";
    for (let i = 0; i < department?.length; i++) {
      str = `${str}${str && ","}${department[i]?.value}`;
    }

    setLoading(true);
    const res = await Axios.get(
      `/hcm/HCMRosterReport/GetAttendanceByRoster?monthId=${monthId}&yearId=${yearId}&workplaceGroupId=${workplaceGroupId}&businessUnitId=${buId}&deptList=${str}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getDepartmentDDL = async (
  accountId,
  buId,
  setter,
  isAddAllField = false
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    let data = res?.data;
    isAddAllField && data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};


export const getWorkplaceGroupDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};