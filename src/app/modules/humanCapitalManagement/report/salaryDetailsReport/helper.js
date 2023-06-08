import axios from "axios";

export const getSalaryDetailsReport = async (
  buList,
  wgId,
  monthId,
  yearId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);

    let str = "";
    for (let i = 0; i < buList?.length; i++) {
      str = `${str}${str && ","}${buList[i]?.value}`;
    }

    const res = await axios.get(
      `/hcm/HCMReport/GetSalaryDetailsReport?businessUnitId=${str}&workPlaceGroupId=${wgId}&monthId=${monthId}&yearId=${yearId}&isDownload=false`
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
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
