import Axios from "axios";
export const getEmployeeDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    const data = res?.data.map((itm) => {
      return {
        ...itm,
        value: itm?.value,
        label: itm?.label,
      };
    });
    setter(data);
  } catch (error) {
    setter([]);
  }
};
export const GetEmployeeAttendenceDetailsReport = async (
  empId,
  month,
  year,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMEmployeeAttendanceDetailsReport/GetEmployeeAttendenceDetailsReport?EmployeeId=${empId}&Month=${month}&Year=${year}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeAttendenceDetailsInOutReport = async (
  type,
  empId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/hcm/HCMEmployeeAttendanceDetailsReport/GetEmployeeAttendenceDetailsInOutReport?Type=${type}&EmployeeId=${empId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
