import axios from "axios";

export const getBuDDLForEmpDirectoryAndSalaryDetails = async (
  accId,
  setter
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
