import Axios from "axios";
import { toast } from "react-toastify";

export const getCalenderDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetCalenderDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const fetchLandingData = async (
  accId,
  buId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMRosterReport/GetRosterLanding?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const getEmployeeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
    console.log(error?.message);
  }
};

export const saveRoster = async (
  partId,
  userId,
  payload,
  cb,
  setDisabled,
  type,
  rosterGroupName,
  accId,
  buId
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/HCMRosterReport/CreateRosterReport?PartId=${partId}&ActionBy=${userId}&strRosterGroupName=${rosterGroupName}&AccountId=${accId}&BusinessUnitId=${buId}`,
      payload
    );
    toast.success(res?.data?.message || "Submitted successfully", {
      toastId: "saveRoster",
    });
    if (type === "create") {
      cb();
    }
    setDisabled(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again",
      {
        toastId: "SaveRosterError",
      }
    );
    setDisabled(false);
  }
};

export const editRoster_api = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/hcm/HCMRosterReport/EditRosterGroup`,
      payload
    );
    toast.success(res?.data?.message || "Submitted successfully", {
      toastId: "EDITRoster",
    });
    setDisabled(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again",
      {
        toastId: "SaveRosterError",
      }
    );
    setDisabled(false);
  }
};

export const getSingleData = async (
  empId,
  setter,
  setInitDataForEdit,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMRosterReport/GetRosterById?RosterGroupHeaderId=${empId}`
    );
    let newArray = res?.data.map((item) => {
      return {
        calender: {
          label: item?.strCalendarName,
          value: item?.intCalendarId,
        },
        nextCalender: {
          label: item?.strNextCalenderName,
          value: item?.intNextCalenderId,
        },
        nextChangeDate: item?.dteNextChangeDate,
        noOfChangeDays: item?.intNoOfDaysChange,
        runningCalender: false, // item?.isRunningCalendar
        intCalendarSetupId: item?.intCalendarSetupId,
      };
    });
    if (newArray) {
      setInitDataForEdit({
        rosterGroupId: res?.data?.[0]?.intRosterGroupId,
        rosterGroupName: res?.data?.[0]?.strRosterGroupName,
        rotation: res?.data.length >= 2 ? true : false,
        calender: "",
        noOfChangeDays: "",
        nextChangeDate: "",
        nextCalender: "",
        runningCalender: false,
      });
      setter(newArray);
      setDisabled(false);
    }
  } catch (error) {
    setter("");
    setDisabled(false);
  }
};
