import Axios from "axios";
import { toast } from "react-toastify";

export const getCalenderDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetCalenderDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    let data = [...res?.data];
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};
export const getCalenderRoasterDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetCalenderRosterDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    let data = [...res?.data];
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const runningCalender_api = async (roasterHeaderId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMRosterReport/GetRosterGroupByCalenderIdDDL?RoasterGrpHeaderId=${roasterHeaderId}`
    );
    setter(res.data);
  } catch (error) {
    setter("");
  }
};

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modfid = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      code: item?.workplaceCode,
      workplaceGroupId: item?.workplaceGroupId,
    }));
    setter(modfid);
  } catch (error) {
    setter([]);
  }
};

export const roasterDetailsLanding_api = async (
  attendanceDate,
  calenderId,
  setter,
  setLoader,
  accId,
  buId,
  workplaceId,
  calendarTypeId
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMRosterReport/GetRosterReport?accountId=${accId}&businessUnitId=${buId}&workPlaceId=${workplaceId}&calendarId=${calenderId}&userDate=${attendanceDate}&CalenderTypeId=${calendarTypeId}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};

// End of helper

export const getDepartmentDDLAction = async (accId, bId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${accId}&BusinessUnitId=${bId}`
    );
    const newData = [{ value: 0, label: "All Department" }, ...res?.data];
    setter(newData);
  } catch (error) {
    setter([]);
  }
};

export const AttendanceReportLandingAction = async (
  businessUnitId,
  departmentId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/EmployeeAttendance/EmployeeAttendanceReportDetails?BusinessUnitId=${businessUnitId}&DepartmentId=${departmentId}&FromDate=${fromDate}&ToDate=${toDate}`
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
