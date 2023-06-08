import Axios from "axios";

export const GetDepartmentWithAccountIdDDL_api = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAccountIdDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetDesignationDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDesignationWithBusinessUnitDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const GetLineManagerWithACCandBusDDL_api = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetLineManagerWithACCandBusDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getYearDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getEmployeeValuesCompetencyGrid_api = async (
  search,
  accId,
  buId,
  departmentId,
  designationId,
  supervisorId,
  yearId,
  pageNo,
  pageSize,
  setter
) => {
  const searchPath = search ? `search=${search}&` : "";
  const ifdepartmentId = departmentId ? `DepartmentId=${departmentId}&` : "";
  const ifdesignationId = designationId
    ? `DesignationId=${designationId}&`
    : "";
  const ifsupervisorId = supervisorId ? `SupervisorId=${supervisorId}&` : "";
  const ifyearId = yearId ? `YearId=${yearId}&` : "";
  try {
    const res = await Axios.get(
      `/pms/AssignFunctionalCompetency/EmployeeValuesCompetencyReportLandingPagination?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&${ifdepartmentId}${ifdesignationId}${ifsupervisorId}${ifyearId}viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
