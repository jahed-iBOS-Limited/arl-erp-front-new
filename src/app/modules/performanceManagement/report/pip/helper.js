import Axios from "axios";

export const GetKpiLandingReportAction = async (
  ddlName,
  buId,
  ddlValue,
  yearId,
  setter,
  setLoading,
  fromMonthId,
  toMonthId
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/pms/Kpi2/GetKpiLandingReport?businessUnitId=${buId}&searchDDL=${ddlName}&searchValue=${ddlValue}&isDashBoard=false&yearId=${yearId}&fromMonthId=${fromMonthId || 13}&toMonthId=${toMonthId || 24}&isPIPReport=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getEmployeeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDepartmentDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAccountIdDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getYearDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
