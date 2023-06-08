import axios from "axios";
import { toast } from "react-toastify";

export const getYearDDL = async (empId, setter) => {
  try {
    const res = await axios.get(
      `/pms/CopyKpi/GetKpiEmployeeYearDDL?employeeId=${empId}`
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

export const getYearDDLForCopyKpiYear = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/pms/CopyKpi/GetKpiBusinessUnitYearDDL?businessUnitId=${buId}`
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

export const getGridDataForCopyYearAction = async (yearId, buId, setter) => {
  try {
    const res = await axios.get(
      `/pms/CopyKpi/GetKpiEmployeeLandingByYearId?businessUnitId=${buId}&yearId=${yearId}`
    );
    if (res?.status === 200) {
      let rowData = res?.data?.map((data) => {
        return {
          ...data,
          isChecked: false,
        };
      });
      setter(rowData);
    }
    
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

export const saveCopyKpiForEmployee = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(`/pms/CopyKpi/CreateCopyKpiForEmployee`, data);
    if (res.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};


export const saveCopyKpiForYear = async (gridData, values, cb, setDisabled) => {
  
  let filteredData = gridData?.filter((item) => item?.isChecked === true);

  if (filteredData?.length < 1)
    return toast.warn("Please select all or atleast one");

  setDisabled(true);
  try {
    let rowData = filteredData?.map((item) => ({
      fromEmployeeId: item?.employeeId,
      toEmployeeId: item?.employeeId,
      fromYearId: values?.year?.value,
      toYearId: values?.copyYear?.value,
    }));
    const res = await axios.post(
      `/pms/CopyKpi/CreateCopyKpiForEmployeeList`,
      rowData
    );
    cb();
    toast.success(res?.data?.message || "Submitted successfully");
    setDisabled(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setDisabled(false);
  }
};
