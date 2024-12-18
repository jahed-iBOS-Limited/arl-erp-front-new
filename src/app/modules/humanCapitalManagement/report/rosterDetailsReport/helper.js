import Axios from 'axios';
import { toast } from 'react-toastify';
export const getDepartmentDDL = async (
  accountId,
  buId,
  setter,
  isAddAllField = false,
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${accountId}&BusinessUnitId=${buId}`,
    );
    let data = res?.data;
    isAddAllField && data.unshift({ value: 0, label: 'All' });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const roasterReportDetailsLanding_api = async (
  monthId,
  yearId,
  buId,
  department,
  setLoading,
  setter,
  workplaceGroupId,
  empTypeId,
) => {
  try {
    let str = '';
    for (let i = 0; i < department?.length; i++) {
      str = `${str}${str && ','}${department[i]?.value}`;
    }

    setLoading(true);
    const res = await Axios.get(
      `/hcm/HCMRosterReport/GetRosterReportDetails?monthId=${monthId}&yearId=${yearId}&workplaceGroupId=${workplaceGroupId}&businessUnitId=${buId}&deptList=${str}&employmentTypeId=${empTypeId}`,
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getWorkplaceGroupDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`,
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getEmpTypeDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    const data = [...res?.data];
    data.unshift({ value: 0, label: 'All' });
    setter(data);
  } catch (error) {
    setter([]);
  }
};
