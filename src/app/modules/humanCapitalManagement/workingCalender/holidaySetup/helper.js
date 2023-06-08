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

export const GetCalenderSetUpPagination = async (
  accId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/HolidaySetup/HolidaySetupLandingPagination?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const saveHolidaySetup_Action = async (payload, cb, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      "/hcm/HolidaySetup/CreateHolidaySetup",
      payload
    );

    toast.success(res?.data?.message);
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again"
    );
    setDisabled(false);
  }
};

export const saveEditedHolidaySetup = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/hcm/HolidaySetup/EditHolidaySetup`, data);
    toast.success(res.data?.message);
    setDisabled(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again"
    );
    setDisabled(false);
  }
};

export const getSingleDataById = async (holidaySetupId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HolidaySetup/GetHolidaySetupById?holidaySetupHeaderId=${holidaySetupId}`
    );

    const { intHolidaySetupHeaderId, strHolidayName } = res?.data?.header;
    const newData = {
      headerId: intHolidaySetupHeaderId,
      holidayGroupName: strHolidayName,
      rowData: res?.data?.row,
    };

    setter(newData);
  } catch (error) {
    setter("");
    toast.error(error?.response?.data?.message);
  }
};

export const getSingleData = async (
  holidaySetupId,
  setter,
  setInitDataForEdit,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/hcm/HolidaySetup/GetHolidaySetupById?holidaySetupHeaderId=${holidaySetupId}`
    );
    let newArray = res?.data.map((item) => {
      return {
        fromDate: item?.dteNextChangeDate,
        toDate: item?.intNoOfDaysChange,
        description: item?.isRunningCalendar,
        holidayGroupName: item?.intCalendarSetupId,
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
    setter("")
    setDisabled(false);
  }
};
