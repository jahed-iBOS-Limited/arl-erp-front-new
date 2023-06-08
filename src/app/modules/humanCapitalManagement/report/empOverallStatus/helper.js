import axios from "axios";

export const getEmpOverallStatusReport = async (
  date,
  workplaceGroupId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMReport/GetEmployeeOverallStatus?ReportDate=${date}&BusinessUnitId=${buId}&WorkPlaceGroupId=${workplaceGroupId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getWorkplaceGroupDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
    );
    const data = [...res?.data];
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};
