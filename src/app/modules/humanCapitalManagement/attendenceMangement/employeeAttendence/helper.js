import Axios from "axios";
import { toast } from "react-toastify";

// Supervisor DDL List
export const getSupervisorDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeAttendance/GetSupervisorListDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

// get Row DTO List
export const getRowDto = async (
  supId,
  day,
  month,
  year,
  setter,
  date,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/hcm/EmployeeAttendance/EmployeeAttendanceStatusList?supervisorId=${supId}&DayId=${day}&MonthId=${month}&YearId=${year}&Attendancedate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};

//Save Employee Attendence

export const saveEmployeeAttendence = async (
  data,
  cb,
  setGridData,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/EmployeeAttendance/CreateEmployeeAttendance`,
      data
    );
    if (res.status === 200) {
      setGridData([]);
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
