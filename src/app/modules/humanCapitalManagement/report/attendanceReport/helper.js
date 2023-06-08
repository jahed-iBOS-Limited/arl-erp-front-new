import Axios from "axios";
import { toast } from "react-toastify";

export const getWorkplaceDDLAction = async (accId, bId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${bId}`
    );
    let obj = { value: 0, label: "All" };
    const newData = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      ...item,
    }));
    newData.unshift(obj)
    setter(newData);
  } catch (error) {
    setter([]);
  }
};

export const AttendanceReportLandingAction = async (
  businessUnitId,
  workplaceId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/EmployeeAttendance/EmployeeAttendanceReportDetails?BusinessUnitId=${businessUnitId}&WorkplaceId=${workplaceId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};

export const getAttendanceDetails = async (empId, fromDate, toDate, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeAttendance/GetEmployeeAttendanceReportById?EmployeeId=${empId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res.data);
  } catch (error) {
    setter("");
  }
};