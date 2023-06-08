import Axios from "axios";
import { toast } from "react-toastify";

export const getDepartmentWithCorporateDDLAction = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDepartmentWithCorporateDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    let data = res?.data;
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};


export const getEmploymentTypeDDLAction = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    let data = res?.data;
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const saveEmployeeAttendence = async (data, cb, setter) => {
  try {
    const res = await Axios.post(
      `/hcm/EmployeeAttendance/CreateUpdatedEmployeeAttendanceNew`,
      data
    );
    setter(res?.data);
    cb && cb();
    toast.success("updated successfully");
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeAttendanceAction = async (
  buId,
  deptId,
  attDate,
  status,
  punchStatus,
  empId,
  workplaceGrpId,
  setter,
  setDisabled,
  jobTypeId
) => {
  try {
    setDisabled(true);
    setter([])
    const res = await Axios.get(
      `hcm/EmployeeAttendance/GetEmployeeAttendenceInfo?BusinessUnitId=${buId}&Department=${deptId}&WorkPlaceGroupId=${workplaceGrpId}&AttendanceDate=${attDate}&Status=${status}&PunchStatus=${punchStatus}&FindByEmpId=${empId}&JobTypeId=${jobTypeId}`
    );
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};



export const getWorkplaceGroupDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
    );
    const data = [...res?.data];
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};