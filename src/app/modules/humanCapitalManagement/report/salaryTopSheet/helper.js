import axios from "axios";

export const getSalaryTopSheetReport = async (
  accId,
  buId,
  workPlaceGroupId,
  positionGroupId,
  monthId,
  yearId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMReport/GetSalaryTopSheetReport?accountId=${accId}&businessUnitId=${buId}&workPlaceGroupId=${workPlaceGroupId}&positionGroupId=${positionGroupId}&monthId=${monthId}&yearId=${yearId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getPositionGroupDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetEmployeePositionGroupByAccountDDL?accountId=${accId}`
    );
    let data = [...res?.data]
        data.unshift({ value: 0, label: "All"})
    setter(data);
  } catch (error) {
    setter([]);
  }
};



export const getSalaryTopSheetReportDetails = async (
  buId,
  reporTypeId,
  workPlaceGroupId,
  positionGroupId,
  monthId,
  yearId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMReport/GetSalaryTopSheetReportDetails?reportTypeId=${reporTypeId}&businessUnitId=${buId}&workPlaceGroupId=${workPlaceGroupId}&positionGroupId=${positionGroupId}&monthId=${monthId}&yearId=${yearId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};