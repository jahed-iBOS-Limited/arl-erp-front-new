import Axios from "axios";
import { toast } from "react-toastify";

export const saveCalenderSetUp = async (data, cb, setDisabled) => {
  const {
    isFriday,
    isThursday,
    isWednesday,
    isTuesday,
    isMonday,
    isSunday,
    isSaturday,
  } = data?.calender;

  try {
    if (
      isFriday ||
      isThursday ||
      isWednesday ||
      isTuesday ||
      isMonday ||
      isSunday ||
      isSaturday
    ) {
      setDisabled(true);
      const res = await Axios.post(
        `/hcm/CalenderSetup/CreateCalenderSetup`,
        data
      );
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: "saveCalenderSetUp",
      });
      cb();
      setDisabled(false);
    } else {
      return toast.warn("Please add atleast one working day");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      toastId: "saveCalenderSetUpERR",
    });
    setDisabled(false);
  }
};

export const GetCalenderSetUpPagination = async (
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
      `/hcm/CalenderSetup/CalenderSetupLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

export const GetHolidaySetupDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HolidaySetup/GetHolidayName?accountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetHolidaySetupDDLRowData = async (
  holidaySetupHeaderId,
  setter
) => {
  try {
    setter([]);
    const res = await Axios.get(
      `/hcm/HolidaySetup/GetHolidayDescriptions?holidaySetupHeaderId=${holidaySetupHeaderId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getSingleDataById = async (calenderId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/CalenderSetup/GetCalenderSetupById?CalenderId=${calenderId}`
    );

    if (res?.status === 200) {
      const {
        calenderName,
        startTime,
        endTime,
        minWorkHour,
        extendedStartTime,
        lastStartTime,
        isSaturday,
        isSunday,
        isMonday,
        isTuesday,
        isWednesday,
        isThursday,
        isFriday,
      } = res?.data?.calender;
      // const { exceptionId, exceptionName, weekdayName, weekdayNo, weekdayId, weekdayNoId } = res?.data?.offday;

      const newData = {
        calenderName: calenderName,
        startTime: startTime,
        endTime: endTime,
        minworkHour: minWorkHour,
        allowedStartTime: extendedStartTime,
        latestStartTime: lastStartTime,
        saturday: isSaturday,
        sunday: isSunday,
        monday: isMonday,
        tuesday: isTuesday,
        wednessday: isWednesday,
        thursday: isThursday,
        friday: isFriday,
        remarks: res?.data?.offday ? res.data.offday?.exceptionName : "",
        dayOfWeekDDL: {
          label: res?.data?.offday ? res.data.offday?.weekdayName : "",
          value: res?.data?.offday ? res.data.offday?.weekdayId : "",
        },
        numOfWeekDDL: {
          label: res?.data?.offday ? res.data.offday?.weekdayNo : "",
          value: res?.data?.offday ? res.data.offday?.weekdayNoId : "",
        },
        exceptionId: res?.data?.offday ? res.data.offday?.exceptionId : "",
        holyday: res?.data?.holyday,
      };

      setter(newData);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const saveEditedCalenderSetup = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/hcm/CalenderSetup/EditCalenderSetup`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully", {
        toastId: "saveEditedCalenderSetup",
      });
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      toastId: "saveEditedCalenderSetupErr",
    });
    setDisabled(false);
  }
};

// Calender Setup Helper End
