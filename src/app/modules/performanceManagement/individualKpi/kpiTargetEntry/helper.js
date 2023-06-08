import axios from "axios";

export const getYearDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDepartmentWithAccountIdDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAccountIdDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDesignationDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDesignationWithBusinessUnitDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// kpi landing
export const getKpiLandingPagination = async (
  accId,
  buId,
  departmentId,
  designationId,
  yearId,
  setLoader,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  const searchPath = search ? `Search=${search}&` : "";
  const departmentSearch = departmentId ? `DepartmentId=${departmentId}&` : "";
  const designationSearch = designationId
    ? `DesignationId=${designationId}&`
    : "";
  const yearSearch = yearId ? `Year=${yearId}&` : "";
  try {
    const res = await axios.get(
      `/pms/KPI/GetKpiLanding?${departmentSearch}${designationSearch}${yearSearch}${searchPath}AccountId=${accId}&BusinessUnit=${buId}&Emp_Dept_SbuType=1&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

// `/pms/KPI/GetKpiLanding?DepartmentId=${departmentId}&DesignationId=${designationId}&Year=${yearId}&${searchPath}AccountId=${accId}&BusinessUnit=${buId}&Emp_Dept_SbuType=1&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
